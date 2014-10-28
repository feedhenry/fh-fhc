
module.exports = appendpoints;
appendpoints.endpoints = appendpoints;

appendpoints.desc = "List the endpoints exposed by a cloud app"
appendpoints.usage = "fhc appendpoints <app-id> --env=<environment>";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("../../utils/exec.js");
var millicore = require("../../utils/millicore.js");
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main ping entry point
function appendpoints (argv, cb) {
  var args = argv._;
  if (args.length === 0){
    return cb(appendpoints.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(args);
  return getAppEndPoints(appId, deployTarget, cb);
}

function getAppEndPoints(appId, target, cb){
  target = target || "dev";
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/endpoints", {guid: appId, deploytarget: target}, "Error getting app endpoints: ", function(err, data) {
    if (err) return cb(err);
    log.info("Endpoints: " + util.inspect(data));
    return cb(err, data);
  });
}

// bash completion
appendpoints.completion = function (opts, cb) {
  common.getAppIds(cb);
};
