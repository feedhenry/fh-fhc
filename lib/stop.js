
module.exports = stop;

stop.usage = "fhc stop <app-id> [env]";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("./utils/exec.js");
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main stop entry point
function stop (args, cb) {
  if (args.length === 0){
    return cb(stop.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(args);
  return stopApp(appId, deployTarget, cb);
}

function stopApp(appId, deployTarget, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/stop", {guid: appId, deploytarget: deployTarget}, "Error starting app: ", function(err, data) {
    if (err) return cb(err);
    log.info("App Stopped");
    log.silly(data, "stop app");
    return cb(err, data);
  });
}

// bash completion
stop.completion = function (opts, cb) {
  common.getAppIds(cb);
};
