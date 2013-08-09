
module.exports = undeploy;

undeploy.usage = "fhc undeploy <app-id> [env] [apptype] (where 'apptype' is 'cloud' (default) or 'embed')" +
                "\ne.g. fhc undeploy 12345 dev cloud";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main undeploy entry point
function undeploy (args, cb) {
  if (args.length === 0){
    return cb(undeploy.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = args[1];
  var appType = args[2];
  return undeployApp(appId, deployTarget, appType, cb);
};

function undeployApp(appId, deployTarget, appType, cb) {
  var target = deployTarget || 'dev';
  var type = appType || "cloud";
  var params = {
    guid: appId,
    apptype: type,
    deploytarget: target
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/environments/" + target + "/apps/" + appId + "/undeploy", params, "Error undeploying app: ", function(err, data) {
    if (err) return cb(err);
    log.info("App Undeployed");
    log.silly(data, "undeploy app");
    return cb(err, data);
  });
}

// bash completion
undeploy.completion = function (opts, cb) {
  common.getAppIds(cb);
};