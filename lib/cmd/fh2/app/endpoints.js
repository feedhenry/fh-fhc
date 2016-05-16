/* globals i18n */
module.exports = endpoints;
endpoints.endpoints = endpoints;

endpoints.desc = i18n._("List the endpoints exposed by a cloud app");
endpoints.usage = "fhc app endpoints <app-id> --env=<environment>";

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var util = require('util');
var ini = require('../../../utils/ini');

// Main ping entry point
function endpoints(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(endpoints.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(argv);
  return getAppEndPoints(appId, deployTarget, cb);
}

function getAppEndPoints(appId, target, cb) {
  target = target || "dev";
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/endpoints", {
    guid: appId,
    deploytarget: target
  }, i18n._("Error getting app endpoints: "), function (err, data) {
    if (err) {
      return cb(err);
    }
    log.info(i18n._("Endpoints: ") + util.inspect(data));
    return cb(err, data);
  });
}

// bash completion
endpoints.completion = function (opts, cb) {
  common.getAppIds(cb);
};
