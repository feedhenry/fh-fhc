
module.exports = initlocal;
initlocal.initlocal = initlocal;

initlocal.usage = "fhc initlocal <app-id>";

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
var cheerio = require('cheerio');

// Main read entry point
function initlocal (args, cb) {
  if (args.length === 0){
    return cb(initlocal.usage);
  }

  var appId = fhc.appId(args[0]);
  return doInitLocal(appId, cb);
};

// read an app
function doInitLocal (appId, cb) {  
  if (!appId) return cb("No appId specified! Usage:\n" + initlocal.usage);
  console.log('url: ' + fhreq.getFeedHenryUrl() + ", domain: " + fhc.target);
  common.getAppContainer(appId, function(err, data) {
    appContainer = cheerio.load(data);
    appContainer('body').text('REPLACE_BODY_HERE');
    fs.mkdir(".fhclocal", function (err) {
      if (err) return cb(err);
      fs.writeFile(path.join(".fhclocal", "container.html"), appContainer.html(), function (err) {
        if (err) return cb(err);
        return cb(undefined, "Files Saved.");
      });
    });
  });
};

// bash completion
initlocal.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
