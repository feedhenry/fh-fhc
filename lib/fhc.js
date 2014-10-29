process.title = "fhc";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (require.main === module) {
  console.error(["It looks like you're doing 'node fhc.js'."
                ,"Don't do that. Instead, run 'node bin/fhc.js'"
                ,"and then use the 'fhc' command line utility."
                ].join("\n"));
  process.exit(1);
}

var EventEmitter = require("events").EventEmitter;
var fhc = module.exports = new EventEmitter;
var ini = require("./utils/ini");
var log = require("./utils/log");
var fs = require("fs");
var path = require("path");
var async = require('async');
var _ = require('underscore');
var semver = require("semver");
var alias = require("./cmd/common/alias");
var commandTree = require('./commandTree');
var genericCommand = require('./genericCommand');
var validateYargs = require('./utils/validate.js');
var usage = require('./usage');

try {
  // startup, ok to do this synchronously
  // TODO: Npm info on FHC to see if the user has the latest version. if not, warn to upgrade
  var j = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))+"");
  fhc.version = j.version;
  fhc.nodeVersionRequired = j.engines.node;
  if (!semver.satisfies(process.version, j.engines.node)) {
    log.error([""
              ,"fhc requires node version: "+j.engines.node
              ,"And you have: "+process.version
              ,"which is not satisfactory."
              ,""
              ,"Bad things will likely happen.  You have been warned."
              ,""].join("\n"), "unsupported version");
  }
} catch (ex) {
  try {
    log(ex, "error reading version");
  } catch (er) {}
  fhc.version = ex;
}

fhc.config = { get : function (key) { return ini.get(key); }
  , set : function (key, val) { return ini.set(key, val, "cli"); }
  , del : function (key, val) { return ini.del(key, val, "cli"); }
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
  
  async.parallel({
    config : function(asyncCb1){
      ini.init(conf, function (err, conf) {
        return asyncCb1(err, conf);
      });
    },
    commands : function(asyncCb2){
      commandTree(asyncCb2);
    }
  }, function(err, asyncInitResults){
    if (err){
      return cb(err);
    }
    var commands = asyncInitResults.commands,
    config = asyncInitResults.config,
    v = fhc.config.get('fhversion'),
    mergedCommands = {};
    
    _.extend(fhc, commands.fhc, commands.common, commands['fh' + v]);
    _.extend(mergedCommands, commands.common, commands['fh' + v]);
    
    //console.log(require('util').inspect(mergedCommands, false, 1, false));
    mergedCommands._groupName = 'fhc';
    
    
    
    fhc.cmdList = usage(mergedCommands);
    fhc.fhcList = usage(commands.fhc);
    // Don't show these: fhc.internalList = usage(commands.internal);
    return cb(null, config);
  });
};

fhc.applyCommandFunction = function(cmd, argv, cb){
  var version = fhc.version,
  cmdFn = fhc[cmd];
  
  // Iterate down to the command we want
  while (typeof cmdFn === 'object' && argv._ && argv._.length > 0){
    cmd = argv._.shift();
    cmdFn = cmdFn[cmd];
  }
  
  if (!cmdFn){
    return cb(new Error('Command not found: ' + cmd));
  }
  
  // Print usage information for a command list (i.e. a directory of commands)
  if (typeof cmdFn === 'object' && argv._ && argv._.length === 0){  
    var msg = ['No action specified. Usage:'];
    msg.push('fhc ' + cmd + ' <action>');
    msg.push('Where <action> is one of:');
    msg.push(usage(cmdFn));
    return cb(msg.join('\n'));
  }
  
  if (argv.help){
    // TODO Needs to work generically for individual commands
    var usageStr = cmdFn.usage || cmdFn.cmd.usage;
    return cb(usageStr);
  }
  
  if (cmdFn.demand){
    // Only new-style commands can be validated
    validateYargs(cmdFn); // TODO Causes CB never called on error    
  }
  
  
  /*
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
