
module.exports = stage;

stage.usage = "\nfhc stage <appId> "  
            + "\nfhc stage <appId> --live "
            +"\nfhc stage <appId> [number_of_instances] --live"
            + "\nStage is made to Live environment if the '--live' flag is used";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var ini = require('./utils/ini');
var apps = require('./apps.js');

// main stage entry point
function stage (args, cb) {
  if(args.length > 4 || args.length == 0) return unknown("stage", cb);

  var clean = ini.get('clean');
  var target = ini.get('live') ? 'live' : 'development';
  var numappinstances;

  // horrible hack for passing flags as args if used from api, e.g. 'live' instead of '--live'
  function processArg(arg) {
    if(Number(arg)) {
      numappinstances = Number(arg);
    }else {
      if(arg === 'live' || arg === 'development') target = arg;
      if(arg === 'clean') clean = true;
    }
  }
  if(args[1]) processArg(args[1]);
  if(args[2]) processArg(args[2]);
  if(args[3]) processArg(args[3]);

  doStage(fhc.appId(args[0]), target, clean, numappinstances, cb);
};

function unknown (action, cb) {
  cb("Wrong arguments for or unknown action: " + action + "\nUsage:\n" + stage.usage);
};

// do our staging..
function doStage(app, target, clean, numappinstances, cb) {
  var type = 'stage';
  
  log.verbose(target, 'Staging Target');
  if(target === 'live' || target === 'Live') {
    type = 'releasestage';
  }

  // constuct uri and payload
  var uri = "box/srv/1.1/ide/" + fhc.domain + "/app/" + type;
  var payload = {payload:{guid: app, clean: clean}};
  if(numappinstances) {
    payload.payload.numappinstances = numappinstances;
  }
  log.silly(payload, "Stage payload");

  // finally do our call
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error staging app: ", function(err, data) {
    if (err) return cb(err);
    async.map([data.cacheKey], common.waitFor, function(err, results) {
      if(err) return cb(err);
      if (results && results[0] && results[0][0] && results[0][0].status === 'complete') {
        stage.message = "App staged ok..";
      }
      
      // Set the 'instances' value if set
      if(numappinstances) {
        log.verbose(numappinstances, "Setting nodejs.numappinstances");
        apps.update(app, "nodejs.numappinstances", numappinstances, function(err, data){
          if(err) return cb(err);
          log.silly(data, "Response from apps update");
          return cb(err, results);        
        });
      }else {
        return cb(err, results); 
      }
    });
  });
};

// bash completion
stage.completion = function (opts, cb) {
  common.getAppIds(cb); 
};