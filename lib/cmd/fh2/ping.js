/* globals i18n */
module.exports = ping;
ping.ping = ping;

ping.usage = "fhc ping <app-id> --env=<environment>";
ping.desc = i18n._("Ping a FeedHenry cloud app");

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

// Main ping entry point
function ping(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(ping.usage);
  }
  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(argv);
  return pingApp(appId, deployTarget, cb);
}

function pingApp(appId, deployTarget, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/ping", {
    guid: appId,
    deploytarget: deployTarget
  }, i18n._("Error pinging app: "), function (err, data) {
    if (err) return cb(err);
    log.info(i18n._("Ping: ") + data.ping_status);
    log.silly(data, "ping app");
    return cb(err, data);
  });
}

// bash completion
ping.completion = function (opts, cb) {
  common.getAppIds(cb);
};
