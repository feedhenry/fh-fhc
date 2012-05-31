
module.exports = read;
read.read = read;

read.usage = "fhc read <app-id>";

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

// Main read entry point
function read (args, cb) {
  if (args.length === 0){
    return cb(read.usage);
  }

  var appId = fhc.appId(args[0]);
  return doRead(appId, cb);
};

// read an app
function doRead (appId, cb) {  
  if (!appId) return cb("No appId specified! Usage:\n" + read.usage);

  common.readApp(appId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data) {
      read.table = common.createTableForAppProps(data);
    }

    return cb(err, data);
  });
};

// bash completion
read.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
