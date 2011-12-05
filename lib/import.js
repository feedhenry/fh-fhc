
module.exports = imports;

imports.usage = 
  "\nfhc import <feedhenry zip file>";

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

// main import entry point
function imports (args, cb) { 
  if (args.length == 1){
      var file = args[0];
      return importApp(file, cb);
  }else{
    return cb(imports.usage);
  }
};

//
// TODO - Zip file upload this should be more generic, and possibly handled by request.js
//
function importApp(file, cb) {
  if (!path.existsSync(file)) {
    return cb("File doesn't exist: " + file);
  }
  
  log.silly(file, "app import");
  
  var url = '/box/srv/1.1/ide/apps/app/import?location=appanat.zip';
  fhreq.uploadFile(url, file, {type:'feedhenry', location: file}, 'application/zip', function(err, data){
    if(data.status == 'pending') {
      return common.waitForJob(data.cacheKey, 0, cb);
    }else {
      return cb(undefined, data); 
    }
  });
};

