// Misc common functions..
var log = require("./utils/log");
var fhc = require("./fhc");
var util = require('util');
var fhreq = require("./utils/request");
var request = require('request');
var Table = require('cli-table');
var ini = require('./utils/ini');
var alias = require("./alias");
var moment = require("moment");

// Common API call to FeedHenry
exports.doApiCall = function(host, uri, payload, errorMsg, cb) {
  fhreq.POST(host, uri, payload, function (er, remoteData, raw, respose){
    if (er){
      return cb(er);
    }

    if(remoteData.msg != undefined && remoteData.address != undefined){
      if (remoteData.address["login-status"] == 'none'){
        return cb("Error, check your login details.. \n" + remoteData.msg);
      }
    }       

    if (remoteData.status != undefined && remoteData.status !== 'ok'){
      var msg = remoteData.message || remoteData.msg;
      return cb(errorMsg + msg, remoteData);
    }
    return cb(undefined, remoteData);
  }); 
};

exports.getAppContainer = function(appId, cb) {
  var uri = 'box/srv/1.1/wid/' + fhc.target + '/studio/' + appId + '/container';

  fhreq.GET(fhreq.getFeedHenryUrl(), uri, function (err, remoteData, raw, respose){
    if (err) return cb(err);
    return cb(undefined, raw);      
  });
};

// Poll remote job until its finished
exports.waitForJob = function(cacheKey, start, cb) {
  var wantJson = ini.get('json');
  setTimeout(function() {
    log.silly("polling for cacheKey: " + cacheKey + " start: " + start + " to complete", "Polling");
    var cc = new Object();
    cc.cacheKey = cacheKey;
    cc.start = start;
    var params = [cc];

    var uri = 'box/srv/1.1/dat/log/read?cacheKeys=' + JSON.stringify(params);
    uri = uri.replace(/"/g,'%22');

    fhreq.GET(fhreq.getFeedHenryUrl(), uri, function (err, remoteData, raw, respose){

      if (err) return cb(err);
      if (remoteData[0] && remoteData[0].status != undefined && remoteData[0].status == 'pending') {
        log.silly(remoteData[0].log, "waitforjob");
        start++;
        if(!wantJson) {
          if(remoteData[0].progress){
            console.log("Progress: " + remoteData[0].progress + "%");
          }else {
            process.stdout.write('.');
          }
        }
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

// gets our app name via 'hosts' api
exports.getAppNameUrl = function(appId, env, cb){
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/hosts", {payload: {guid: appId}}, "", function(err, data){
    if(err) return cb(err);
    log.silly(data, "hosts");
    return cb(undefined, data.hosts[env + '-name'], data.hosts[env + '-url']);
  });  
  
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
  var maxId=4, maxTitle=5, maxDescription=11, maxAlias=5;

  for (var a in apps) {
    var app = apps[a],ali = alias.getAliasByGuid(app.id);
    app.alias = (ali !== undefined) ? ali : "";
    if(strlen(app.alias) > maxAlias) maxAlias = strlen(app.alias);
    if(strlen(app.id) > maxId) maxId = strlen(app.id);
    if(strlen(app.title) > maxTitle) maxTitle = strlen(app.title);
    if(strlen(app.description) > maxDescription) maxDescription = strlen(app.description);
  }
 
  if (maxDescription > exports.maxTableCell) maxDescription = exports.maxTableCell;
  if (maxTitle > exports.maxTableCell) maxTitle = exports.maxTableCell;

  // create our table
  var table = new Table({ 
    head: ['Id', 'Title', 'Description','Alias'],
    colWidths: [maxId +2 , maxTitle + 2, maxDescription + 2, maxAlias + 2],
    style: exports.style()
  });
  
  // populate our table
  for (var b in apps) {
    var app = apps[b];
    table.push([app.id, app.title, app.description, app.alias]);
  } 
  return table; 
};

// put resources into table format..
exports.createTableForResources = function(resources) {
  var vals = [];
  for (var name in resources.usage) {
    var head = name + " (Max)";
    if(name.toLowerCase() === "mem" || name.toLowerCase() === "disk") {
      vals[head] = bytesToSize(resources.usage[name]) + " (" + bytesToSize(resources.max[name]) + ")";
    } else if(name.toLowerCase() === "cpu") {
      vals[head] = resources.usage[name] + "% (" + resources.max[name] + "%)";
    } else {
      vals[head] = resources.usage[name] + " (" + resources.max[name] + ")";
    }
  }
  return createObjectTable(vals);
};

exports.createTableForNotifications = function(notifications) {
  var maxId=24, maxUser=25, maxTS = 20, maxType = 18, maxMessage = 25;
  for(var i=0;i<notifications.length;i++){
    var noti = notifications[i].fields;
    if(strlen(noti.eventType) > maxType) maxType = strlen(noti.eventType);
    if(strlen(noti.message) > maxMessage) maxMessage = strlen(noti.message);
    if(strlen(noti.updatedBy) > maxUser) maxUser = strlen(noti.updatedBy);
  }
  if(maxType > exports.maxTableCell) maxType = exports.maxTableCell;
  if(maxMessage > exports.maxTableCell) maxMessage = exports.maxTableCell;

  var table = new Table({
    head:['Guid', 'When', 'Updated By', 'Notification Type', 'Detail'],
    colWidths: [maxId+2, maxTS+2, maxUser+2, maxType+2, maxMessage+2],
    style: exports.style()
  });

  for(var p=0;p<notifications.length;p++){
    var not = notifications[p].fields;
    table.push([ notifications[p].guid, moment(not.sysCreated, 'YYYY-MM-DD h:mm:ss:SSS').fromNow(), not.updatedBy, not.eventType, not.message.replace(/[\r?\n]/g, " ")]);
  }
  return table;
}

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + sizes[i];
}

exports.createTableForTemplates = function (apps) {
  return exports.createTableForApps(apps);
};

// lists all our FeedHenry Apps
function listApps(cb) {
  var payload ={};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/list", payload, "Error reading app: ", cb);
};

function listTemplates(cb) {
  var payload = {};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/templatelist", payload, "Error reading template: ", cb);
}

// returns an array of App Ids
function formatIds(err, data, cb) {
  if(err) return cb(err);
  var ids = [];
  if(!err) {
    for (var i=0; i<data.list.length; i++){
      var app = data.list[i];
      ids.push(app.id);
    }
  }
  return cb(err, ids);
}

function getAppIds(cb) {
  listApps(function (err, data) {
    formatIds(err, data, cb);
  });
}

function getTemplateIds(cb) {
  listTemplates(function (err, data) {
    formatIds(err, data, cb);
  });
}

// common read app
function readApp(appId, cb) {
  var payload = {payload:{guid: appId}};
  exports.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/read", payload, "Error reading app: ", cb);
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

//Create a generic Table for a list of objects
//header object should define the key and max width
function createListTable(headers,list){
  var heads = [], colWidths = [], cols = [];
  for (var k in headers) {
    heads.push(k.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase();}));
    cols.push(k);
    var v = headers[k];
    var width = Math.max(strlen(k), v) + 2;
    if (width > exports.maxTableCell) width = exports.maxTableCell;
    colWidths.push(width);
  }

  var table = new Table({ 
    head: heads,
    colWidths: colWidths,
    style: exports.style()
  });

  for(var i=0;i<list.length;i++){
    var obj = list[i];
    var out = [];
    for(var j=0;j<cols.length;j++){
      var col_name = cols[j];
      out.push(obj[col_name]);
    }
    table.push(out);
  }
  return table;
}

// table format for a single app.. we convert into a generic N/V pair table of app properties
function createTableForAppProps(app) {
  var pairs = {
    Id : app.inst.guid,
    Title: app.inst.title,
    Description: app.inst.description,
    W3C: app.app.w3cid,
    Widg: app.app.guid, 
    Config: JSON.stringify(app.inst.config)
  };
  var scm = app.app.config.scm;
  if (scm) {
    if (scm.url) pairs["Git Url"] = scm.url; 
    if (scm.branch) pairs["Git Branch"] = scm.branch; 
    if (scm.key) pairs["Key"] = scm.key; 
  }

  return createNVTable(pairs);
};


//parse <key>=<value> format
function parseArgs(args) {
    var opts = new Object();
    for(var i=0; i<args.length; i++) {
        var arg = args[i];
        if(arg.indexOf('=') == -1) throw new Error('Invalid argument format: ' + arg);
        var kv = arg.split("=");
        log.silly(kv, 'build arg');
        opts[kv[0]] = (kv[1] == undefined ? "" : kv[1]);
    }

    return opts;
};

// Annoyingly, 'request' returns nulls, the rest of FHC uses undefined, so return undefined to keep
// things consistent.
exports.nullToUndefined = function(err) {
  return err == null? undefined: err;
};


exports.createNVTable = createNVTable;
exports.createObjectTable = createObjectTable;
exports.createTableForAppProps = createTableForAppProps;
exports.createListTable = createListTable;
exports.listApps = listApps;
exports.listTemplates = listTemplates;
exports.readApp = readApp;
exports.getAppIds = getAppIds;
exports.getTemplateIds = getTemplateIds;
exports.strlen = strlen;
exports.maxTableCell = 100;
exports.parseArgs = parseArgs;

