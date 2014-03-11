
module.exports = read;
read.read = read;

read.usage = "fhc read [project-id] <app-id>";

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
var runtimes = require('./runtimes.js');

// Main read entry point
function read (args, cb) {
  if (args.length === 0){
    return cb(read.usage);
  }

  if (args.length === 1) {
    var appId = fhc.appId(args[0]);
    return doRead(null, appId, cb);
  }

  var projectId = fhc.appId(args[0]);
  var appId = fhc.appId(args[1]);
  return doRead(projectId, appId, cb);
};

// read an app
function doRead(projectId, appId, cb) {
  if (!cb) {
    appId = projectId;
    cb = appId;
    projectId = null;
  }

  if (!appId) return cb("No appId specified! Usage:\n" + read.usage);

  common.readApp(projectId, appId, function(err, app){
    if(err) return cb(err);
    if(ini.get('table') === true && app) {
		    read.table = common.createTableForAppProps(app);
    }

    return cb(err, app);
  });
};

// bash completion
read.completion = function (opts, cb) {
  common.getAppIds(cb);
};
