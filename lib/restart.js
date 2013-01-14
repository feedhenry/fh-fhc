module.exports = restart;

restart.usage = "fhc restart <app-id> [env]";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("./utils/exec.js");
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');
var start = require('./start');
var stop = require('./stop');

// Main restart entry point
function restart (args, cb) {
  if (args.length === 0){
    return cb(restart.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = args[1];
  return restartApp(appId, deployTarget, cb);
};

function restartApp(appId, deployTarget, cb) {
  var target = deployTarget||'dev';
  stop([appId, target], function(err, res){
    if(err){
      return cb(err);
    }
    start([appId, target], function(err, resp){
      if(err){
        cb(err);
      }
      cb(null, resp);
    });
  });
}

// bash completion
restart.completion = function (opts, cb) {
  common.getAppIds(cb);  
};