
/*
log levels:
0,1,2,3
verbose,info,warn,error

Default setting for logs is "info"
Default setting to show is "info"

Possible values of level/loglevel:
silly,verbose,info,warn,error,win,silent

silent quiets everything


*/


module.exports = log;

var output = require("./output.js");

function colorize (msg, color) {
  return msg ? "\033["+color+"m"+msg+"\033[0m" : "";
};

var l = -1
  , LEVEL = { silly   : l++
            , verbose : l++
            , info    : l++
            , WARN    : l++
            , "ERR!"  : l++
            , ERROR   : "ERR!"
            , ERR     : "ERR!"
            , win     : 0x15AAC5
            , paused  : 0x19790701
            , silent  : 0xDECAFBAD
            }
  , COLOR = {}
  , SHOWLEVEL
  , normalNames = {};
log.LEVEL = LEVEL;
normalNames[LEVEL["ERR!"]] = "error";
normalNames[LEVEL.WARN] = "warn";
normalNames[LEVEL.info] = "info";
normalNames[LEVEL.verbose] = "verbose";
normalNames[LEVEL.silly] = "silly";
normalNames[LEVEL.win] = "win";

Object.keys(LEVEL).forEach(function (l) {
  if (typeof LEVEL[l] === "string") LEVEL[l] = LEVEL[LEVEL[l]];
  else LEVEL[LEVEL[l]] = l;
  LEVEL[l.toLowerCase()] = LEVEL[l];
  if (l === "silent" || l === "paused") return
  log[l] = log[l.toLowerCase()] =
    function (msg, pref, cb) { return log(msg, pref, l, cb) };
});

COLOR[LEVEL.silly] = 30;
COLOR[LEVEL.verbose] = "34;40";
COLOR[LEVEL.info] = 32;
COLOR[LEVEL.warn] = "30;41";
COLOR[LEVEL.error] = "31;40";
for (var c in COLOR) COLOR[LEVEL[c]] = COLOR[c];
COLOR.fhc = "37;40";
COLOR.pref = 35;

var logBuffer = [];
var ini = require("./ini");
var waitForConfig;
log.waitForConfig = function () { waitForConfig = true; };

// now the required stuff has been loaded,
// so the transitive module dep will work
var sys = require("./sys")
  , fhc = require("../fhc")
  , net = require("net");

Object.defineProperty(log, "level",
  { get : function () {
      if (typeof SHOWLEVEL !== "undefined") return SHOWLEVEL;
      var show = fhc.config && fhc.config.get("loglevel") || 'warn';
      show = show.split(",")[0];
      if (!isNaN(show)) show = +show;
      else if (!LEVEL.hasOwnProperty(show)) {
        sys.error("Invalid loglevel config: "+JSON.stringify(show));
        show = "info";
      }
      if (isNaN(show)) show = LEVEL[show];
      else show = +show;
      if (!waitForConfig || ini.resolved) SHOWLEVEL = show;
      return show;
    }
  , set : function (l) {
      SHOWLEVEL = undefined;
      fhc.config.set("showlevel", l);
    }
  });

function log (msg, pref, level, cb) {
  if (typeof level === "function") cb = level, level = null
  var show = log.level;
  if (show === LEVEL.silent || show === LEVEL.paused) return cb && cb();
  if (level == null) level = LEVEL.info;
  if (isNaN(level)) level = LEVEL[level];
  else level = +level;
  // logging just undefined is almost never the right thing.
  // a lot of these are kicking around throughout the codebase
  // with relatively unhelpful prefixes.
  if (msg === undefined && level > LEVEL.silly) {
    msg = new Error("undefined log message");
  }
  if (typeof msg === "object" && (msg instanceof Error)) level = LEVEL.error;
  if (!ini.resolved && waitForConfig || level === LEVEL.paused) {
    return logBuffer.push([msg, pref, level, cb]);
  }
  if (logBuffer.length && !logBuffer.discharging) {
    logBuffer.push([msg, pref, level, cb]);
    logBuffer.discharging = true;
    logBuffer.forEach(function (l) { log.apply(null, l); });
    logBuffer.length = 0;
    delete logBuffer.discharging;
    return;
  }
  log.level = show;
  fhc.emit("log", { level : level, msg : msg, pref : pref, cb : cb });
  fhc.emit("log."+normalNames[level], { msg : msg, pref : pref, cb : cb });
};

var loglog = log.history = [];
var loglogLen = 0;

fhc.on("log", function (logData) {
  var level = logData.level
    , msg = logData.msg
    , pref = logData.pref
    , cb = logData.cb || function () {}
    , show = log.level
    , spaces = "    "
    , logFD = fhc.config.get("logfd");
  if (msg instanceof Error) {
    if (fhc.config.get('stack')){
      msg = logData.msg = msg.stack || msg.toString();  
    }else{
      msg = logData.msg || msg.stack || msg.toString();
      msg = msg.toString();
    }
  }
  loglog.push(logData);
  loglogLen ++;
  if (loglogLen > 2000) {
    loglog = loglog.slice(loglogLen - 1000);
    loglogLen = 1000;
  }
  if (!isFinite(level) || level < show) return cb();
  if (typeof msg !== "string" && !(msg instanceof Error)) {
    msg = sys.inspect(msg, 0, 4, true);
  }

  // console.error("level, showlevel, show", level, show, (level >= show))
  pref = colorize("fhc", COLOR.fhc)
       + (COLOR[level] ? " "+colorize(
           (LEVEL[level]+spaces).substr(0,4), COLOR[level]) : "")
       + (pref && COLOR.pref ? " " + colorize(pref, COLOR.pref) : "");
  if (msg.indexOf("\n") !== -1) {
    msg = msg.split(/\n/).join("\n"+pref+" ");
  }
  msg = pref+" "+msg;
  return output.write(msg, logFD, cb);
});

log.er = function (cb, msg) {
  if (!msg) throw new Error(
    "Why bother logging it if you're not going to print a message?")
  return function (er) {
    if (er) log.error(msg);
    cb.apply(this, arguments);
  };
};
