/* globals i18n */
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

function runtimes(argv, cb) {
  var args = argv._;
  var deployTarget = ini.getEnvironment(argv);
  var platform = "FEEDHENRY";
  var runtime = "nodejs";
  if (args.length > 0) {
    platform = args[0];
  }
  platform = platform.toUpperCase();
  runtime = runtime.toUpperCase();

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/runtimes", {
    deploytarget: deployTarget,
    "platform": platform,
    "runtime": runtime
  }, i18n._("failed to get runtimes: "), function (err, data) {
    if (err) return cb(err);
    if (ini.get("table") === true) {
      runtimes.table = common.createRuntimeTable(data);
    }
    for (var i = 0; i < data.result.length; i++) {
      delete data.result[i].path;
    }
    return cb(err, data);
  });
}

runtimes.desc = i18n._("Lists cloud runtimes available");
runtimes.usage = "fhc runtimes\n" +
  "fhc runtimes <platform>";
module.exports = runtimes;
