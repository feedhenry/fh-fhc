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
var config = require("./cmd/internal/fhcfg");
var ini = require("./utils/ini");
var log = require("./utils/log");
var fs = require("fs");
var util = require("util");
var path = require("path");
var async = require('async');
var _ = require('underscore');
var which = require("./utils/which");
var semver = require("semver");
var findPrefix = require("./utils/find-prefix");
var alias = require("./cmd/common/alias");
var commandTree = require('./commandTree');

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
    fhc.version = fhc.config.get('fhversion');
    fhc.commands = asyncInitResults.commands;
    
    if (fhc.version === 2){
      delete fhc.commands.fh3;
    }else{
      delete fhc.commands.fh2;
    }
    
    fhc.cmdList = _.map(_.values(_.omit(fhc.commands, 'internal')), _.keys);
    fhc.cmdList = _.flatten(fhc.cmdList);
    fhc.fhcList = _.keys(fhc.commands.internal);
    return cb(null, asyncInitResults.config);
  });
};

fhc.getCommandFunction = function(cmd){
  var cmds = fhc.commands,
  version = fhc.version,
  versionSpecificCommands = cmds['fh' + version];
  cmdFn = cmds.common[cmd] || cmds.internal[cmd] || versionSpecificCommands[cmd];
  
  if (!cmdFn){
    throw new Error('Command not found: ' + cmd);
  }
  return cmdFn;
};

Object.defineProperty(fhc, "target",
                      { get : function () {
                        var domain = ini.get("domain", "user");
                        if (!domain) {
                          throw("Unable to determine domain - please login again.");
                        }
                        return domain;
                      }
                      });
