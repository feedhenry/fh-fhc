/* globals i18n */

module.exports = start;

start.desc = i18n._("Start a cloud app");
start.usage = "fhc app start <app-id> --env=<environment>";

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var ini = require('../../../utils/ini');

// Main start entry point
function start (argv, cb) {
  var args = argv._;
  if (args.length === 0){
    return cb(start.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(argv);
  return startApp(appId, deployTarget, cb);
}

function startApp(appId, deployTarget, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/start", {guid: appId, deploytarget: deployTarget}, i18n._("Error starting app: "), function(err, data) {
    if (err) return cb(err);
    log.info(i18n._("App Started"));
    log.silly(data, "start app");
    return cb(err, data);
  });
}

// bash completion
start.completion = function (opts, cb) {
  common.getAppIds(cb);
};
