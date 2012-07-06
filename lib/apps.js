
module.exports = apps;
apps.list = list;

apps.usage = "\nfhc apps";

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
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main apps entry point
function apps (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'read') {
    return cb("The 'fhc apps read' command is deprecated. Please use 'fhc read' command instead.");
  }else if (action === 'create'){
    return cb("The 'fhc apps create' command is deprecated. Please use 'fhc create' command instead.");
  }else if (action === 'update'){
    return cb("The 'fhc apps update' command is deprecated. Please use 'fhc update' command instead.");
  }else if (action === 'delete'){
    return cb("The 'fhc apps delete' command is deprecated. Please use 'fhc delete' command instead.");
  } else if (action === 'ping'){
    return cb("The 'fhc apps ping' command is deprecated. Please use 'fhc ping' command instead.");
  } else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb(apps.usage);
  }
}

// list apps
function list(cb) {
  common.listApps(function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      apps.table = common.createTableForApps(data.list);
    }
    return cb(err, data);
  });
}


// bash completion
apps.completion = function (opts, cb) {
};
