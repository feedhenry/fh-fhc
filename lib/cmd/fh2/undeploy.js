/* globals i18n */
module.exports = undeploy;

undeploy.desc = i18n._("Undeploy a cloud app");
undeploy.usage = i18n._("fhc undeploy <app-id> [apptype] --env=<environment> (where 'apptype' is 'cloud' (default) or 'embed')" +
                        "\ne.g. fhc undeploy 12345 cloud --env=dev");

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

// Main undeploy entry point
function undeploy(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(undeploy.usage);
  }

  var appId = fhc.appId(args[0]);
  var appType = args[1];
  var deployTarget = ini.getEnvironment(argv);

  return undeployApp(appId, deployTarget, appType, cb);
}

function undeployApp(appId, deployTarget, appType, cb) {
  var type = appType || "cloud";
  var params = {
    guid: appId,
    apptype: type,
    deploytarget: deployTarget
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/environments/" + deployTarget + "/apps/" + appId + "/undeploy", params, i18n._("Error undeploying app: "), function (err, data) {
    if (err) {
      return cb(err);
    }

    log.info(i18n._("App Undeployed"));
    log.silly(data, "undeploy app");
    return cb(err, data);
  });
}

// bash completion
undeploy.completion = function (opts, cb) {
  common.getAppIds(cb);
};
