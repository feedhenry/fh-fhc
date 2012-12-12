
module.exports = appendpoints;
appendpoints.endpoints = appendpoints;

appendpoints.usage = "fhc appendpoints <app-id> [dev|live]";

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

// Main ping entry point
function appendpoints (args, cb) {
  if (args.length === 0){
    return cb(appendpoints.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = args[1];
  return getAppEndPoints(appId, deployTarget, cb);
};

function getAppEndPoints(appId, target, cb){
  target = target || "dev";
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/endpoints", {guid: appId, deploytarget: target}, "Error getting app endpoints: ", function(err, data) {
    if (err) return cb(err);
    log.info("Endpoints: " + util.inspect(data));
    return cb(err, data);
  });
}

// bash completion
appendpoints.completion = function (opts, cb) {
  common.getAppIds(cb);
};

