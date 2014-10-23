
module.exports = ping;
ping.ping = ping;

ping.usage = "fhc ping <app-id> --env=<environment>";

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
function ping(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(ping.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(args);
  return pingApp(appId, deployTarget, cb);
}

function pingApp(appId, deployTarget, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/ping", {guid: appId, deploytarget: deployTarget}, "Error pinging app: ", function (err, data) {
    if (err) return cb(err);
    log.info("Ping: " + data.ping_status);
    log.silly(data, "ping app");
    return cb(err, data);
  });
}

// bash completion
ping.completion = function (opts, cb) {
  common.getAppIds(cb);
};
