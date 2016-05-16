/* globals i18n */
module.exports = suspend;

suspend.desc = i18n._("Suspend a cloud application");
suspend.usage = i18n._("fhc app suspend <app-id> [apptype] --env=<environment> (where 'apptype' is 'cloud' (default) or 'embed')" +
                       "\ne.g. fhc suspend 12345 cloud --env=dev");

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var ini = require('../../../utils/ini');

// Main suspend entry point
function suspend(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(suspend.usage);
  }

  var appId = fhc.appId(args[0]);
  var appType = args[1];
  var deployTarget = ini.getEnvironment(argv);
  return suspendApp(appId, deployTarget, appType, cb);
}

function suspendApp(appId, deployTarget, appType, cb) {
  var type = appType || "cloud";
  var params = {
    guid: appId,
    apptype: type,
    deploytarget: deployTarget
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/environments/" + deployTarget + "/apps/" + appId + "/suspend", params, i18n._("Error suspending app: "), function (err, data) {
    if (err) return cb(err);
    log.info(i18n._("App Suspended"));
    log.silly(data, "suspend app");
    return cb(err, data);
  });
}

// bash completion
suspend.completion = function (opts, cb) {
  common.getAppIds(cb);
};
