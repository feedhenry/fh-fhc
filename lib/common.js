// Misc common functions..
var log = require("./utils/log");
var fhc = require("./fhc");
var util = require('util');
var fhreq = require("./utils/request");
var request = require('request');
var Table = require('cli-table');
var ini = require('./utils/ini');

// Common API call to FeedHenry
exports.doApiCall = function(host, uri, payload, errorMsg, cb) {
  fhreq.POST(host, uri, payload, function (er, remoteData, raw, respose){
    if (er){
      log.error(errorMsg + er);
      return cb(er);
    }

    if(remoteData.msg != undefined && remoteData.address != undefined){
      if (remoteData.address["login-status"] == 'none'){
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }       

    if (remoteData.status != undefined && remoteData.status != 'ok'){
      return cb(remoteData.message, remoteData);
    }
    return cb(undefined, remoteData);
  }); 
};

// Poll remote job until its finished
exports.waitForJob = function(cacheKey, start, cb) {
  setTimeout(function() {
    log.verbose("polling for cacheKey: " + cacheKey + " start: " + start + " to complete", "Polling");
    var cc = new Object();
    cc.cacheKey = cacheKey;
    cc.start = start;
    var params = [cc];

    var uri = 'box/srv/1.1/dat/log/read?cacheKeys=' + JSON.stringify(params);
    uri = uri.replace(/"/g,'%22');

    fhreq.GET(fhreq.getFeedHenryUrl(), uri, function (err, remoteData, raw, respose){

    // using 'request' module.. 
    // var headers = { "accept" : "application/json" };
    // var cookie = fhc.config.get("cookie");
    // if (cookie != undefined) {    
    //  headers.cookie = "feedhenry=" + cookie + ";";
    //  log.silly(headers.cookie, "cookie");
    // }
    // request({headers: headers, uri: uri}, function(err, resp, remoteData) {              

      if (err) return cb(err);
      if (remoteData[0] && remoteData[0].status != undefined && remoteData[0].status == 'pending') {
        log.silly(remoteData[0].log, "waitforjob");
        start++;
        return exports.waitForJob(cacheKey, start++, cb);
      }else {
        if(remoteData[0] && remoteData[0].status && remoteData[0].status === 'error') {
          return cb(remoteData);
        }else {
          return cb(undefined, remoteData);      
        }
      }
    });
  }, 500);
};

// gets our app name (as it will be when staged)
exports.getAppName = function(appId){
  var fhcluster = fhc.config.get("fhcluster");

  //
  // Note: we replace _ and - with 0's 
  //
  var app = appId.replace(/_/g, '0');
  app = app.replace(/-/g, '0');
  log.silly(fhcluster, 'fh cluster');
  log.silly(appId, 'cf appId');

  var appName = fhcluster + "-" + app;
  return appName.toLowerCase();  
};

// common strlen function
function strlen(str) {
  var s = str;
  if (typeof str === 'number') s = "" + str;
  if (typeof str === 'object') s = str.toString();
  var len = 0;
  if (s) len = s.length;
  return len;  
};

// used in conjunction with async.map to wait for multiple jobs to finish
exports.waitFor = function(key, cb) {
  exports.waitForJob(key, 0, cb);
};

// common style for all our tables
exports.style = function() {
  var color = ini.get('thcolor') || 'green';
  var ret = {
   'padding-left': 1,
   'padding-right': 1,
   head: [color]
  };
  return ret;
};

// put our apps into table format..
exports.createTableForApps = function(apps) {
  // calculate widths
  var maxId=4, maxTitle=5, maxDescription=11;

  for (var a in apps) {
    var app = apps[a];
    if(strlen(app.id) > maxId) maxId = strlen(app.id);
    if(strlen(app.title) > maxTitle) maxTitle = strlen(app.title);
    if(strlen(app.description) > maxDescription) maxDescription = strlen(app.description);
  }
 
  if (maxDescription > exports.maxTableCell) maxDescription = exports.maxTableCell;
  if (maxTitle > exports.maxTableCell) maxTitle = exports.maxTableCell;

  // create our table
  var table = new Table({ 
    head: ['Id', 'Title', 'Description'], 
    colWidths: [maxId +2 , maxTitle + 2, maxDescription + 2],
    style: exports.style()
  });
  
  // populate our table
  for (var b in apps) {
    var app = apps[b];
    table.push([app.id, app.title, app.description]);
  } 
  return table; 
};

// lists all our FeedHenry Apps
function listApps(cb) {
  var payload ={};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/list", payload, "Error reading app: ", cb);
};

// returns an array of App Ids
function getAppIds(cb) {
  listApps(function(err, data){
    if(err) return cb(err);
    var ids = [];
    if(!err) {
      for (var i=0; i<data.list.length; i++){
        var app = data.list[i];
        ids.push(app.id);
      }
    }
    return cb(err, ids);
  });
}

// common read app
function readApp(appId, cb) {
  var payload = {payload:{guid: appId}};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/read", payload, "Error reading app: ", cb);
};

// Create a generic 'Name/Value' Table
function createNVTable(pairs) {
  var nvs = [];
  var maxName = 4, maxValue = 5;
  for (var name in pairs) {
    var value = pairs[name];
    if(strlen(name) > maxName) maxName = strlen(name);
    if(strlen(value) > maxValue) maxValue = strlen(value);
    nvs.push([name, value.toString()]);
  }

  if (maxValue > exports.maxTableCell) maxValue = exports.maxTableCell;
  var table = new Table({ 
    head: ['Name', 'Value'],
    colWidths: [maxName+2, maxValue+2],
    style: exports.style()
  });

  for (var i=0; i<nvs.length; i++) {
    table.push(nvs[i]);
  }

  return table;
};

// Create a generic Table from a single object. The object keys will be the table headers.
function createObjectTable(obj) {
  var heads = [], colWidths = [], vals = [];
  for (var k in obj) {
    heads.push(k.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();}));
    var v = "" + obj[k];
    vals.push(v);
    var width = Math.max(strlen(k), strlen(v)) + 2;
    if (width > exports.maxTableCell) width = exports.maxTableCell;
    colWidths.push(width);
  }

  var table = new Table({ 
    head: heads,
    colWidths: colWidths,
    style: exports.style()
  });


  table.push(vals);
  return table;
};

exports.createNVTable = createNVTable;
exports.createObjectTable = createObjectTable;
exports.listApps = listApps;
exports.readApp = readApp;
exports.getAppIds = getAppIds;
exports.strlen = strlen;
exports.maxTableCell = 100;

