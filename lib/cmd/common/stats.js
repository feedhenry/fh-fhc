/* globals i18n */
module.exports = stats;

stats.desc = i18n._("Feedhenry cloud application statistics, counters & timers");
stats.usage = "\nfhc stats <app-id> <stats-type> <num-results> --env=<environment>";

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common.js");
var ini = require('../../utils/ini');

// main stats entry point
function stats(argv, cb) {
  var args = argv._;
  if (args.length < 3) return cb(stats.usage);

  var target = ini.getEnvironment(args, 'development');

  var appId = fhc.appId(args[0]);
  var statsType = args[1];
  var numResults = args[2];

  doStats(appId, statsType, numResults, target, cb);
}

// read app statistics
function readAppStats(appId, statsType, numResults, target, cb) {
  var payload = {payload: {guid: appId, deploytarget: target, statstype: statsType, count: numResults}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/stats", payload, i18n._("Error reading app statistics: "), cb);
}

// Get our stats
function doStats(appId, statsType, numResults, target, cb) {
  readAppStats(appId, statsType, numResults, target, function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

// bash completion
stats.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;

  // only complete for 3'rd param, i.e. 'fhc stats <tab>'
  if (argv.length === 2) {
    common.getAppIds(cb);
  }
};
