process.title = "fhc";

if (require.main === module) {
  console.error(["It looks like you're doing 'node fhc.js'."
                ,"Don't do that. Instead, run 'node bin/fhc.js'"
                ,"and then use the 'fhc' command line utility."
                ].join("\n"));
  process.exit(1);
}

var EventEmitter = require("events").EventEmitter;
var fhc = module.exports = new EventEmitter;
var config = require("./fhcfg");
var ini = require("./utils/ini");
var log = require("./utils/log");
var fs = require("fs");
var util = require("util");
var path = require("path");
var abbrev = require("abbrev");
var which = require("./utils/which");
var semver = require("semver");
var findPrefix = require("./utils/find-prefix");
var alias = require("./alias");

fhc.commands = {};
fhc.ELIFECYCLE = {};
fhc.EPUBLISHCONFLICT = {};
fhc.EJSONPARSE = {};
fhc.EISGIT = {};
fhc.ECYCLE = {};
fhc.EENGINE = {};

try {
  // startup, ok to do this synchronously
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

var commandCache = {}
  // short names for common things
  , aliases = {
    'ls' : 'apps'
    ,'rm' : 'delete'
    ,'props' : 'read'
  }
  
  , aliasNames = Object.keys(aliases)
  // 
  // Note: these are filenames in ./lib
  //
  , cmdList = fhc.cmdList = [
              ,'account'
              ,'act'
              ,'admin-devices'
              ,'admin-groups'
              ,'admin-users'
              ,'admin-storeitems'
              ,'admin-appstore'
              ,'admin-policies'
              ,'alias'
              ,'apps'
              ,'build'
              ,'call'
              //,'checkout'
              ,'create'
              ,'cloudfoundry'
              ,'delete'
              ,'deploy-target'
              ,'embed'
              ,'ota'
              ,'configuration'
              ,'files'
              ,'git'
              ,'import'
              ,'keys'
              ,'local'
              ,'logs'
              ,'login'
              ,'logout'
              ,'preview'
              ,'ping'
              ,'read'
              ,'resources'
              ,'search'
              ,'stage'
              ,'stats'
              ,'templates'
              ,'target'
              ,'targets'
              ,'user'
              ,'update'
              ,'version'
              ,'nativecfg'
              ]
  , fhcList = fhc.fhcList = [
              ,'fhcfg'
              ,'completion'
              ,'help'
              ,'set'
              ]
  , plumbing = [
              // internal commands/work in progress
              ,'auth'
              ,'cf'
              ,'df'
              ,'hosts'
              ,'messaging'
              ,'session'
              ,'appinit'
              ,'notifications'
               ]
  , fullList = fhc.fullList = cmdList.concat(aliasNames).concat(fhcList).filter(function (c) {
      return plumbing.indexOf(c) === -1;
    })
  , abbrevs = abbrev(fullList);


Object.keys(abbrevs).concat(plumbing).forEach(function (c) {
  Object.defineProperty(fhc.commands, c, { get : function () {
    if (!loaded) throw new Error(
      "Call fhc.load(conf, cb) before using this command.\n"+
      "See the README.md or cli.js for example usage.")
    var a = fhc.deref(c);
    if (commandCache[a]) return commandCache[a];
    return commandCache[a] = require(__dirname+"/"+a);
  }, enumerable: fullList.indexOf(c) !== -1 });
})

fhc.appId = function (appid) {
  //if its undefined or 24 chars in length return it back so flow continues as normal
    if(!appid || appid.length === 24) return appid;

   //look for alias if none just return the passed string 
  var ali = alias.getAlias(appid);
  return (appid.length > 23) ? appid : (ali === undefined) ? appid : ali; 

};

fhc.deref = function (c) {
  if (plumbing.indexOf(c) !== -1) return c
  var a = abbrevs[c];
  if (aliases[a]) a = aliases[a];
  return a;
}

var loaded = false
  , loading = false
  , loadListeners = [];

fhc.load = function (conf, cb_) {  

  if (!cb_ && typeof conf === "function") cb_ = conf , conf = {}
  if (!cb_) cb_ = function () {};
  if (!conf) conf = {};
  loadListeners.push(cb_);
  if (loaded) return cb();
  if (loading) return;
  loading = true;
  var onload = true;

  function handleError (er) {    
    loadListeners.forEach(function (cb) {
      process.nextTick(function () { cb(er, fhc) });
    })
  }

  function cb (er) {    
    if (er) return handleError(er);
    loaded = true;
    loadListeners.forEach(function (cb) {      
      process.nextTick(function () { cb(er, fhc); });
    });
    loadListeners.length = 0;
    if (onload == onload && fhc.config.get("onload-script")) {      
      require(onload);
      onload = false;
    }
  };
  
  log.waitForConfig();
  which(process.argv[0], function (er, node) {
    if (!er && node !== process.execPath) {
      log.verbose("node symlink", node);
      process.execPath = node;
      process.installPrefix = path.resolve(node, "..", "..");
    }
    ini.resolveConfigs(conf, function (er) {
      if (er) return handleError(er);
      var p;
      if (!fhc.config.get("global")
          && !conf.hasOwnProperty("prefix")) {
        p = process.cwd();
      } else {
        p = fhc.config.get("prefix");
      }
      // try to guess at a good node_modules location.
      findPrefix(p, function (er, p) {        
        if (er) return handleError(er);
        Object.defineProperty(fhc, "prefix",
          { get : function () { return p; }
          , set : function (r) { return p = r; }
          , enumerable : true
          });
        return cb();
      });
    });
  });
};

var path = require("path");
fhc.config =
  { get : function (key) { return ini.get(key); }
  , set : function (key, val) { return ini.set(key, val, "cli"); }
  , del : function (key, val) { return ini.del(key, val, "cli"); }
  };

Object.defineProperty(fhc, "dir",
  { get : function () {
      if (fhc.config.get("global")) {
        return path.resolve(fhc.prefix, "lib", "node_modules");
      } else {
        return path.resolve(fhc.prefix, "node_modules");
      }
    }
  , enumerable : true
  });

Object.defineProperty(fhc, "root",
  { get : function () { return fhc.dir; } });


Object.defineProperty(fhc, "target",
                      { get : function () {
                        var domain = ini.get("domain", "user");
                        if (!domain) {
                          throw("Unable to determine domain - please login again.");
                        }
                        return domain;
                      }
                      });

Object.defineProperty(fhc, "cache",
  { get : function () { return fhc.config.get("cache"); }
  , set : function (r) { return fhc.config.set("cache", r); }
  , enumerable : true
  });

var tmpFolder;
Object.defineProperty(fhc, "tmp",
  { get : function () {
      if (!tmpFolder) tmpFolder = "fhc-"+Date.now();
      return path.resolve(fhc.config.get("tmp"), tmpFolder);
    }
  , enumerable : true
  });
