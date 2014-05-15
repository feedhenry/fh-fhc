
module.exports = hosts;

hosts.usage = "\nfhc hosts <app-id>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common.js");
var util = require('util');

function hosts (args, cb) {
  if (args.length < 1) return cb(hosts.usage);

  var appId = fhc.appId(args[0]);
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/hosts", {payload: {guid: appId}}, "", function(err, data){
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

  // only complete for 3'rd param, i.e. 'fhc hosts <tab>'
  if (argv.length === 2) {
    common.getAppIds(cb);
  }
};
