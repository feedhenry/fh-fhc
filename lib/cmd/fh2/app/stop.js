/* globals i18n */
module.exports = stop;

stop.desc = i18n._("Stop a cloud app");
stop.usage = "fhc app stop <app-id> [env]";

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var ini = require('../../../utils/ini');

// Main stop entry point
function stop(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(stop.usage);
  }
  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(argv);
  return stopApp(appId, deployTarget, cb);
}

function stopApp(appId, deployTarget, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/stop", {
    guid: appId,
    deploytarget: deployTarget
  }, i18n._("Error starting app: "), function (err, data) {
    if (err) return cb(err);
    log.info(i18n._("App Stopped"));
    log.silly(data, "stop app");
    return cb(err, data);
  });
}

// bash completion
stop.completion = function (opts, cb) {
  common.getAppIds(cb);
};
