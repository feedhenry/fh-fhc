
module.exports = start;

start.usage = "fhc start <app-id> [env]";

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

// Main start entry point
function start (args, cb) {
  if (args.length === 0){
    return cb(start.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = args[1];
  return startApp(appId, deployTarget, cb);
};

function startApp(appId, deployTarget, cb) {
  var target = deployTarget || 'dev';
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/start", {guid: appId, deploytarget: target}, "Error starting app: ", function(err, data) {
    if (err) return cb(err);
    log.info("App Started");
    log.silly(data, "start app");
    return cb(err, data);
  });
}

// bash completion
start.completion = function (opts, cb) {
  common.getAppIds(cb);  
};