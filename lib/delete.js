
module.exports = deletes;
deletes.delete = deletes;

deletes.usage = "fhc delete <app-id>";

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

// Main deletes entry point
function deletes (args, cb) {
  if (args.length === 0){
    return cb(deletes.usage);
  }

  var appId = fhc.appId(args);
  return deleteApps(appId, cb);
};

// delete app
function deleteApp(appId, cb) {
  var payload = {payload:{confirmed:"true",guid:appId},context:{}};
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/delete", payload, "Error deleting app: ", function(err, data){
     if (err) return cb(err);
     if (data.inst && data.inst.title) {
       if(!deletes.message) deletes.message = "";
       deletes.message = deletes.message + "Deleted: " + data.inst.id + ' - ' + data.inst.title + "\n";
     }
     
     return cb(err, data);
   });
}

// delete multiple apps
function deleteApps(appId, cb) {  
  var appIds = [], ai, tempId, tempPayload;
  appIds = 'string' === typeof appId ? [appId] : appId;
  async.map(appIds, deleteApp, function(err, results) {
    cb(err, results);      
  });
}

// bash completion
deletes.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
