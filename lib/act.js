
module.exports = act;

act.usage = "\nfhc act <app-id> <server-function> <params> [--live]";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var millicore = require("./utils/millicore.js");
var common = require("./common.js");
var util = require('util');
var ini = require('./utils/ini');
var request = require('request');

// main act entry point
function act (args, cb) {
  if (args.length < 2) return cb(act.usage);

  var target = ini.get('live') ? 'live' : 'development';
  // tmp hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'development') {
    target = args[args.length -1];
    args.pop();    
  }

  var appId = fhc.appId(args[0]);
  var funct = args[1];
  var data = args[2] ? JSON.parse(args[2]): {};
  log.silly(data, "act params");

  if ("live" === target) {
    doLiveAct(appId, funct, data, cb);
  }else {
    doMillicoreAct(appId, funct, data, cb);
  }
};

// TODO - full development proxy (no proxy through millicore)
function doMillicoreAct(appId, funct, data, cb) {  
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/act/" + fhc.domain + "/" + widgId + "/" + funct + "/" + appId, data, function (err, remoteData, raw, response) {
      if (err) {
        log.verbose("Error in act: " + err);
        log.verbose(remoteData, "list");
        return cb(err);
      }
      return cb(err, remoteData);        
    });
  });
}

// Do our live action
// TODO - cache the endpoint lookup (so we don't have to call every time)
function doLiveAct(appId, funct, data, cb) {  
  common.getAppNameUrl(appId, 'live', function(err, appName, appUrl) {
    // post to /cloud
    request({uri: appUrl + "/cloud/" + funct, method: 'POST', json: data}, function (err, response, body) {
      log.silly(response, "act response");
      return cb(common.nullToUndefined(err), body);
    });
  });
};

// bash completion
act.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  
  // only complete for 3'rd param, i.e. 'fhc act <tab>'
  if (argv.length === 2) {  
    common.getAppIds(cb); 
  }
};
