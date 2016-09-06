/* globals i18n */
module.exports = errorHandler;

var cbCalled = false;
var log = require("./log");
var fhc = require("../fhc");
var rm = require("./rm-rf");
var util = require('util');
var constants = require("constants");
var itWorked = false;

process.on("exit", function (code) {
  if (code) itWorked = false;
  if (itWorked) log(i18n._("Command executed with success."));
  else {
    if (!cbCalled) {
      log.error(i18n._("cb() never called!\n "));
    }
    log.win(i18n._("Command executed with error"));
  }
  itWorked = false; // ready for next exit
});

/**
 * Ensuring that an error is logged with a request ID if it is present.
 * @param errorToLog - The error to log.
 */
function logReqError(errorToLog) {
  if (errorToLog && errorToLog.requestId) {
    log.error(errorToLog);
    log.error(util.format(i18n._("Request ID: "), errorToLog.requestId));
  } else {
    log.error(errorToLog);
  }
}

function errorHandler(er) {
  if (cbCalled) throw new Error(i18n._("Callback called more than once."));
  cbCalled = true;
  if (!er) return exit(0);
  if (!(er instanceof Error)) {
    log.error(er);
    return exit(1);
  }
  if (!er.errno) {
    // TODO Refactor error handling functionality (check output.js as well)
    var m = er.message.match(/^(?:Error: )?(E[A-Z]+)/);
    if (m) {
      m = m[1];
      if (!constants[m] && !fhc[m]) constants[m] = {};
      er.errno = fhc[m] || constants[m];
    }
  }
  switch (er.errno) {
    case constants.ECONNREFUSED:
      logReqError(er);
      log.error([i18n._("Connection refused!"),
                 i18n._("Check if your target server is reachable and you have v")
                ].join("\n"));
      break;
    default:
      logReqError(er);
      break;
  }

  var os = require("os");
  log.error("");
  log.error(os.type() + " " + os.release(), "System");
  log.error(process.argv
    .map(JSON.stringify).join(" "), "command");
  exit(typeof er.errno === "number" ? er.errno : 1);
}

function exit(code) {
  var doExit = fhc.config.get("_exit");
  log.verbose([code, doExit], "exit");
  if (code) writeLogFile(reallyExit);
  else {
    rm("fhc-debug.log", function () {
      rm(fhc.tmp, reallyExit);
    });
  }
  function reallyExit() {
    itWorked = !code;
    if (doExit) process.exit(code || 0);
    else process.emit("exit", code || 0);
  }
}

function writeLogFile(cb) {
  var fs = require("fs")
    , fstr = fs.createWriteStream("fhc-debug.log")
    , sys = require("util");

  log.history.forEach(function (m) {
    var lvl = log.LEVEL[m.level]
      , pref = m.pref ? " " + m.pref : ""
      , b = lvl + pref + " "
      , msg = typeof m.msg === "string" ? m.msg
        : msg instanceof Error ? msg.stack || msg.message
        : sys.inspect(m.msg, 0, 4);
    fstr.write(new Buffer(b
      + (msg.split(/\n+/).join("\n" + b))
      + "\n"));
  });
  fstr.end();
  fstr.on("close", cb);
}
