
module.exports = stage;

stage.usage = "\nfhc stage <appId> "  
            + "\nfhc stage <appId> --live " 
            + "\nStage is made to Live environment if the '--live' flag is used";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var ini = require('./utils/ini');

// main stage entry point
function stage (args, cb) {
  if(args.length > 3 || args.length == 0) return unknown("stage", cb);

  var clean = ini.get('clean');
  var target = ini.get('live') ? 'live' : 'development';
  if (args[1]) target = args[1];
  if (args[2]) clean = args[2] === 'clean';

  doStage(fhc.appId(args[0]), target, clean, cb);
};

function unknown (action, cb) {
  cb("Wrong arguments for or unknown action: " + action + "\nUsage:\n" + stage.usage);
};

// do our staging..
function doStage(app, target, clean, cb) {
  var type = 'stage';
  
  log.verbose(target, 'Staging Target');
  if(target === 'live' || target === 'Live') {
    type = 'releasestage';
  }

  // constuct uri and payload
  var uri = "box/srv/1.1/ide/" + fhc.domain + "/app/" + type;
  var payload = {payload:{guid: app, clean: clean}};
  
  // finally do our call
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error staging app: ", function(err, data) {
    if (err) return cb(err);
    async.map([data.cacheKey], common.waitFor, function(err, results) {
      if (results && results[0] && results[0][0] && results[0][0].status === 'complete') {
        stage.message = "App staged ok..";
      }
      return cb(err, results);
    });
  });
};

// bash completion
stage.completion = function (opts, cb) {
  common.getAppIds(cb); 
};