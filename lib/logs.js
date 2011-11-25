
module.exports = logs;
logs.logs = logs;
logs.usage = "\nfhc logs <app id> --live";

var log = require("./utils/log");
var fhc = require("./fhc");
var common = require("./common");
var util = require('util');
var ini = require('./utils/ini');
var fhreq = require("./utils/request");

// main logs entry point
function logs(args, cb) { 
  if (args.length < 1 || args.length > 2) return cb(logs.usage);

  var appId = args[0];
  var target = ini.get('live') ? 'live' : 'development';
  if (args[1]) target = args[1];

  return doLogs(appId, target, cb);
};

// get our log files
function doLogs (appId, target, cb) {  
  var payload = {payload:{guid: appId, deploytarget: target}};
  log.verbose(payload, 'Getting logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/logs", payload,"Error showing logs: ", cb);
};

// bash completion
logs.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  // only complete for 3'rd param, i.e. 'fhc logs <tab>'
  if (argv.length === 2) {  
    common.getAppIds(cb); 
  }
};