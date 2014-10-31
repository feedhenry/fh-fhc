process.title = "fhc";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (require.main === module) {
  console.error([
    "It looks like you're doing 'node fhc.js'.",
    "Don't do that. Instead, run 'node bin/fhc.js'",
    "and then use the 'fhc' command line utility."
  ].join("\n"));
  process.exit(1);
}

var EventEmitter = require("events").EventEmitter;
var fhc = module.exports = new EventEmitter();
var ini = require("./utils/ini");
var log = require("./utils/log");
var fs = require("fs");
var path = require("path");
var async = require('async');
var _ = require('underscore');
var semver = require("semver");
var alias = require("./cmd/fh2/alias");
var commandTree = require('./commandTree');
var argUtils = require('./utils/args.js');
var help = require('./cmd/fhc/help');
var version = require('./cmd/common/version');

try {
  // startup, ok to do this synchronously
  var j = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))+"");
  fhc._version = j.version;
  fhc.nodeVersionRequired = j.engines.node;
  if (!semver.satisfies(process.version, j.engines.node)) {
    log.error([
      "",
      "fhc requires node version: "+j.engines.node,
      "And you have: "+process.version,
      "which is not satisfactory.",
      "",
      "Bad things will likely happen.  You have been warned.",
      ""
    ].join("\n"), "unsupported version");
  }
} catch (ex) {
  try {
    log(ex, "error reading version");
  } catch (er) {}
  fhc._version = ex;
}

fhc.config = { 
  get : function (key) { 
    return ini.get(key); 
  },
  set : function (key, val) { 
    return ini.set(key, val, "cli"); 
  },
  del : function (key, val) { 
    return ini.del(key, val, "cli"); 
  }
};  
  
fhc.appId = function (appid) {
  //if its undefined or 24 chars in length return it back so flow continues as normal
    if(!appid || appid.length === 24) return appid;

   //look for alias if none just return the passed string
  var ali = alias.getAlias(appid);
  return (appid.length > 23) ? appid : (ali === undefined) ? appid : ali;

};

fhc.load = function (conf, cb) {
  if (!cb){
    cb = conf;
    conf = {};
  }
  
  async.series({
    config : function(asyncCb1){
      ini.init(conf, function (err, conf) {
        return asyncCb1(err, conf);
      });
    },
    commands : function(asyncCb2){
      commandTree(asyncCb2);
    },
    checkLatestVersion : function(asyncCb3){
      version.checkFHCUpToDate(function(isUpToDate){
        if (!isUpToDate){
          log.warn(version.updateMessage());
        }
        return asyncCb3(null, isUpToDate);
      });
    }
  }, function(err, asyncInitResults){
    if (err){
      return cb(err);
    }
    var commands = asyncInitResults.commands,
    config = asyncInitResults.config,
    v = fhc.config.get('fhversion') || 3;
    
    fhc._tree = commands; // help picks up on this later to draw the usage chart
    
    _.extend(fhc, commands.fhc, commands.common, commands['fh' + v]);
    return cb(null, config);
  });
};

fhc.applyCommandFunction = function(processArgv, cb){
  var cmdFn = fhc,
  cmds = [],
  cmd, argv, yargs;
  
  // Iterate down to the command we want
  while (typeof cmdFn !== 'function' && typeof cmdFn !== 'undefined' && processArgv && processArgv.length > 0){
    cmd = processArgv.shift();
    cmds.push(cmd);
    cmdFn = cmdFn[cmd];
  }
  
  if (!cmdFn){
    return cb(new Error('Command not found: ' + cmd));
  }
  
  yargs = argUtils.normaliseToYargs(processArgv, cmdFn);
  argv = yargs.argv;
  
  // Print usage information for a command list (i.e. a directory of commands)
  if (typeof cmdFn === 'object' && argv._ && argv._.length === 0){  
    return help.commandGroupUsageError(cmds, cmdFn, cb);
  }
  
  if (argv.help){
    return help.singleCommandUsage(cmdFn, cb);
  }
  
  // Only new-style commands can be validated
  if (cmdFn.demand){
    try{
      argUtils.validate(yargs, cmdFn);
    }catch(err){
      return cb(err);
    }
  }
  
  /*
    Finally perform the command. 
    Nesessary to delay before calling this as bin/fhc relies on properties appended
    to 'cmdFn'. TODO: Refactor this, but means lots of changes to fh2 cmds
  */
  process.nextTick(function(){
    cmdFn(argv, cb);
  });
  
  return cmdFn;
};

Object.defineProperty(fhc, "curTarget",
                      { get : function () {
                        var domain = ini.get("domain", "user");
                        if (!domain) {
                          throw("Unable to determine domain - please login again.");
                        }
                        return domain;
                      }
                      });
