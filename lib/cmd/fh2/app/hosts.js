/* globals i18n */
module.exports = hosts;

hosts.usage = "\nfhc app hosts <app-id>";
hosts.desc = i18n._("Lists the cloud hosts available for a cloud app");

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common.js");

function hosts(argv, cb) {
  var args = argv._;
  if (args.length < 1) return cb(hosts.usage);

  var appId = fhc.appId(args[0]);
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/hosts", {payload: {guid: appId}}, "", function (err, data) {
    if (err) {
      log.error(i18n._("Error in hosts: "), err);
      return cb(err);
    }
    return cb(err, data);
  });
}

// bash completion
hosts.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;

  // only complete for 3'rd param, i.e. 'fhc hosts <tab>'
  if (argv.length === 2) {
    common.getAppIds(cb);
  }
};
