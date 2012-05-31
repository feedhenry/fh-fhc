
module.exports = act;

act.usage = "\nfhc act <app-id> <server-function> <params> [--live]";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common.js");
var util = require('util');
var ini = require('./utils/ini');
var request = require('request');
var read = require('./read.js').read;

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

  // read app to get widget guid and cloud type
  read([appId], function (err, res) {
    if(err) return cb(err);

    var app = res.app;
    var inst = res.inst;
    var widgId = app.guid;
    var nodejs = 'boolean' === typeof inst.nodejs ? inst.nodejs : (inst.nodejs === 'true' ? true : false);

    if (nodejs) {
      if ("live" === target) {
        doLiveAct(appId, funct, data, cb);
      }else {
        doDevAct(appId, funct, data, cb);
      }
    } else {
      // rhino apps don't have a dev and live, just one environment,
      // which is in millicore
      if ("live" === target) {
        cb("Live environment not available for Rhino Apps", null);
      } else {
        doMillicoreAct(appId, widgId, funct, data, cb);
      }
    }
  });
}

// TODO - full development proxy (no proxy through millicore)
function doMillicoreAct(appId, widgId, funct, data, cb) {
  log.silly(widgId, "widgId");
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/act/" + fhc.domain + "/" + widgId + "/" + funct + "/" + appId, data, function (err, remoteData, raw, response) {
    if (err) {
      log.verbose("Error in act: " + err);
      log.verbose(remoteData, "list");
      return cb(err);
    }
    return cb(err, remoteData);
  });
}

// TODO - cache the endpoint lookup (so we don't have to call every time)
function doAct(appEnv, appId, funct, data, cb) {  
  common.getAppNameUrl(appId, appEnv, function(err, appName, appUrl) {
    if(err) return cb(err);
    if (!appUrl.match(/\/$/)) appUrl = appUrl + '/';

    // post to /cloud
    request({uri: appUrl + "cloud/" + funct, method: 'POST', json: data}, function (err, response, body) {
      log.silly(response, "act response");
      return cb(common.nullToUndefined(err), body);
    });
  });
}

// Do our live action
function doLiveAct(appId, funct, data, cb) {
  doAct('live', appId, funct, data, cb);
}

// Do our dev action
function doDevAct(appId, funct, data, cb) {
  doAct('development', appId, funct, data, cb);
}

// bash completion
act.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  
  // only complete for 3'rd param, i.e. 'fhc act <tab>'
  if (argv.length === 2) {  
    common.getAppIds(cb);
  }
};
