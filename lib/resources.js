
module.exports = resources;

resources.usage = "\nfhc resources <appId> "
            + "\nfhc resources <appId> --live "
            + "\nResources retrieved from live environment if the '--live' flag is used";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var ini = require('./utils/ini');

// main resources entry point
function resources (args, cb) {
  if(args.length > 1 || args.length == 0) return unknown("resources", cb);

  var clean = ini.get('clean');
  var target = ini.get('live') ? 'live' : 'dev';

  // horrible hack for passing flags as args if used from api, e.g. 'live' instead of '--live'
  function processArg(arg) {
    if(arg === 'live' || arg === 'dev') target = arg;
  }
  if(args[1]) processArg(args[1]);

  doResources(fhc.appId(args[0]), target, cb);
}

function unknown (action, cb) {
  cb("Wrong arguments for or unknown action: " + action + "\nUsage:\n" + resources.usage);
}

// do resources call
function doResources(app, target, cb) {
  var type = 'resources';  
  log.silly(target, 'Target');

  // constuct uri and payload
  var uri = "box/srv/1.1/ide/" + fhc.target + "/app/" + type;
  log.silly(uri, uri);
  var payload = {payload:{guid: app, deploytarget: target}};
  log.silly(payload, "payload");

  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error getting resources for app: ", function(err, data) {
    if(err) return cb(err);
    log.silly(data, "setstagingconfig");
    if(ini.get('table') === true && data.data) {
      resources.table = common.createTableForResources(data.data);
    }
    return cb(undefined, data);
  });
}

// bash completion
resources.completion = function (opts, cb) {
  common.getAppIds(cb); 
};