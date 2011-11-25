
module.exports = cf;
cf.usage = "\nfhc cf act <app id> <server function> <params>"
         + "\nfhc cf apps"
         + "\nfhc cf app <app id>";
         + "\nfhc cf url <app id>";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var millicore = require("./utils/millicore.js");
var util = require('util');
var fhcluster, cftarget, cfuser, cfpwd;
var vmcjs = require('vmcjs');
var common = require('./common.js');

// main CloudFoundry entry point..
function cf (args, cb) {
  var action = args.shift();
  switch (action) {       
    case "apps": case "ls": return apps(cb);
    case "app":  { 
      if (args.length != 1) return unknown("app", cb);
      else return app(args[0], cb);
    };
    case "act": {
      if (args.length < 2) return unknown("act", cb);
      return act(args[0], args[1], args[2], cb);
    };
    case "url":  { 
      if (args.length != 1) return unknown("url", cb);
      else return url(args[0], cb);
    };
    default: return unknown(action, cb);
  }
}

function unknown (action, cb) {  
  var msg = action ? "Wrong arguments for or unknown action: " + action + "\n" : "";
  msg += "Usage:\n" + cf.usage;
  cb(msg);
};

// gets the app endpoint from the dftarget
function getAppUrl(appId){
  var appName = common.getAppName(appId);
  var cftarget = fhc.config.get("cftarget");
  return cftarget.replace('api', appName);  
};

// do our act call
function act(appId, funct, params, cb) {
  var data = {};
  if (params) data = JSON.parse(params);
  log.silly(data, "cf act params");
  
  // replace 'api' with the modified appId to get our enpoint
  var appUrl = getAppUrl(appId);
  log.verbose('' + appUrl, "CloudFoundry App endpoint");
  log.verbose('' + funct, "Function"); 

  // post to /cloud
  fhreq.POST(appUrl, 'cloud/' + funct, data, function (err, remoteData, raw, response) {
    if (err) {
      log.error(err, "Error in cf act");
      log.verbose(remoteData, "list");
    }
    return cb(err, remoteData);        
  });
};

// given an app id, returns its DynoFarm endpoint
function url(appId, cb) {  
  var appName = common.getAppName(appId);
  var url = getAppUrl(appId);
  return cb(undefined, {name: appName, url:url});
};

// get our CloudFoundry apps
function apps(cb) {
  var cftarget = fhc.config.get("cftarget"); 
  var cfuser = fhc.config.get("cfuser"); 
  var cfpwd = fhc.config.get("cfpwd"); 
  var vmc = new vmcjs.VMC(cftarget, cfuser, cfpwd);

  vmc.login(function(err) {
    if(err) return cb(err);
    vmc.apps(function(err, apps){
      if(err) return cb(err);
      return cb(err, apps);
    });
  });
};

// get CF info for a single app
function app(appId, cb) {
  var appName = common.getAppName(appId).toLowerCase();
  log.verbose(appName, "AppName");

  apps(function(err, apps) {
    if(err) return cb(err);
    for (var i=0; i<apps.length; i++) {
      var app = apps[i];
      log.verbose(app.name, 'CF App');
      if (app.name.toLowerCase() === appName) {
        return cb(err, app);
      }
    }
    return cb();
  });
};

// bash completion
cf.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "cf") argv.unshift("cf");
  if (argv.length === 2) {
    var cmds = ["act", "apps", "app", "url"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    // todo: complete with valid values, if possible.
    case "act":
    case "apps":
    case "app":
    case "url":
      return cb(null, Object.keys(types));
    default: return cb(null, []);
  }
};