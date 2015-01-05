
module.exports = hosts;

hosts.usage = "\nfh app hosts <app-id>";
hosts.desc = "Lists the cloud hosts available for a cloud app";

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common.js");
var util = require('util');

function hosts (argv, cb) {
  var args = argv._;
  if (args.length < 1) return cb(hosts.usage);

  var appId = fhc.appId(args[0]);
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/hosts", {payload: {guid: appId}}, "", function(err, data){
    if (err) {
      log.error("Error in hosts: ", err);
      return cb(err);
    }
    return cb(err, data);
  });
}

// bash completion
hosts.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;

  // only complete for 3'rd param, i.e. 'fh hosts <tab>'
  if (argv.length === 2) {
    common.getAppIds(cb);
  }
};
