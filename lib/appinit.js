
module.exports = appinit;

appinit.usage = "\nfhc appinit <app-id> <app-key> [<params>]";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common.js");
var util = require('util');
var ini = require('./utils/ini');
var request = require('request');
var read = require('./read.js').read;

// main appinit entry point
function appinit (args, cb) {
  if (args.length < 2) return cb(appinit.usage);

  var appId = fhc.appId(args[0]);
  var appKey = args[1];
  var data = args[2] ? JSON.parse(args[2]): {};
  log.silly(data, "act params");

  doMillicoreInit(appId, appKey, data, cb);
}

function doMillicoreInit(appId, appKey, data, cb) {
  log.silly(appKey, "appKey");
  var dataToSend = JSON.parse(JSON.stringify(data));
  dataToSend.appid = appId;
  dataToSend.appkey = appKey;
  dataToSend.destination = 'fhc';
  dataToSend.cuid = '12345678790123456787901234567879012';
  dataToSend.sdk_version = 'FHC_SDK';
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/app/init", dataToSend, function (err, remoteData, raw, response) {
    if (err) {
      log.verbose("Error in init: " + err);
      log.verbose(remoteData, "list");
      return cb(err);
    }
    return cb(err, remoteData);
  });
}

// bash completion
appinit.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  
  // only complete for 3'rd param, i.e. 'fhc appinit <tab>'
  if (argv.length === 2) {  
    common.getAppIds(cb);
  }
};
