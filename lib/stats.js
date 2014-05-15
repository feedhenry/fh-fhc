
module.exports = stats;

stats.usage = "\nfhc stats <app-id> <stats-type> <num-results> [--live]";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common.js");
var util = require('util');
var ini = require('./utils/ini');

// main stats entry point
function stats (args, cb) {
  if (args.length < 3) return cb(stats.usage);

  var target = ini.get('live') ? 'live' : 'development';
  // tmp hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'development') {
    target = args[args.length -1];
    args.pop();
  }

  var appId = fhc.appId(args[0]);
  var statsType = args[1];
  var numResults = args[2];

  doStats(appId, statsType, numResults, target, cb);
}

// read app statistics
function readAppStats(appId, statsType, numResults, target, cb) {
  var payload = {payload:{guid: appId, deploytarget: target, statstype: statsType, count: numResults}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/stats", payload, "Error reading app statistics: ", cb);
}

// Get our stats
function doStats(appId, statsType, numResults, target, cb) {
  readAppStats(appId, statsType, numResults, target, function(err, data){
    if(err) return cb(err);
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
