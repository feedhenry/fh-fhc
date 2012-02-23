
module.exports = logs;
logs.logs = logs;
logs.usage =  "\nfhc logs [get] <app-id> [log-name] [--live]"
            + "\nfhc logs list <app-id> [--live]"
            + "\nfhc logs delete <app-id> <log-name> [--live]";

var log = require("./utils/log");
var fhc = require("./fhc");
var common = require("./common");
var util = require('util');
var ini = require('./utils/ini');
var fhreq = require("./utils/request");
var Table = require('cli-table');
var datejs = require('datejs');

// main logs entry point
function logs(args, cb) { 
  if (args.length < 1) return cb(logs.usage);
  var target = ini.get('live') ? 'live' : 'development';  

  // hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'development') {
    target = args[args.length -1];
    args.pop();    
  }

  // Otherwise look for an action
  var action = args[0];
  if (action === "get") {
      if (!args[1]) return cb(logs.usage);
      var appId = fhc.appId(args[1]);
      var logName = args[2];
      return getLogs(appId, logName, target, cb);  
  } else if (action === "list") {
    if (!args[1]) return cb(logs.usage);
    var appId = fhc.appId(args[1]);
    return listLogs(appId, target, cb);    
  }else if (action === "delete") {
    if (!args[1]) return cb(logs.usage);
    if (!args[2]) return cb(logs.usage);
    var appId = fhc.appId(args[1]);
    return deleteLog(appId, args[2], target, cb);    
  }else {
    // assume all params are for get
      var appId = fhc.appId(action);
      if(appId.length !== 24) return cb(logs.usage);
      var logName = args[1];
      return getLogs(appId, logName, target, cb);  
  }    
};

// get our log files
function listLogs (appId, target, cb) {  
  var payload = {payload:{guid: appId, deploytarget: target, action: 'list'}};
  log.verbose(payload, 'Listing logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/logs", payload,"Error getting logs: ", function(err, data){
    if(err) return cb(err);
    if(ini.get('table') === true) {
      createTableForLogs(data.logs);
    }
    return cb(err, data);
  });
};

// get list of log files
function getLogs (appId, logName, target, cb) {  
  var payload = {payload:{guid: appId, deploytarget: target, logname: logName, 'action': 'get'}};
  log.verbose(payload, 'Getting logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/logs", payload, "", function(err, data){
    if(err) return cb(err);
    log.verbose(data, "Response log");
    if(!logName) {
      // backward compatability.. 
      var lg = data.log ? data.log: data.logs;
      var logData = "\n====> stdout <====\n" + lg.stdout + "\n====> stderr <====\n" + lg.stderr;
      logs.message = logData;
    }else {
      logs.message = data.log.contents === '' ? '<empty>' : data.log.contents;
    }
    return cb(err, data);
  });
};

// delete log file
function deleteLog (appId, logName, target, cb) {  
  var payload = {payload:{guid: appId, deploytarget: target, action: 'delete', logname: logName}};
  log.verbose(payload, 'Deleting log');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/logs", payload,"Error deleting log: ", function(err, data){
    if(err) return cb(err);
    logs.message = JSON.parse(data.msg);
    return cb(err, data);
  });
};

// put our logs into table format..
function createTableForLogs(logz) {
  // calculate widths
  var maxName=4, maxSize=4, maxModified=8;
  var dateFormat = "ddd MMM dd yyyy HH:mm:ss";
  for (var l in logz) {
    var log = logz[l];
    var dt = new Date(log.modified);
    if(common.strlen(log.name) > maxName) maxName = common.strlen(log.name);
    if(common.strlen(log.size) > maxSize) maxSize = common.strlen(log.size);
    if(common.strlen(dt.toString()) > maxModified) maxModified = common.strlen(dt.toString(dateFormat));   
  }

  // create our table
  logs.table = new Table({ 
    head: ['Name', 'Size', 'Modified'], 
    colWidths: [maxName +2 , maxSize + 2, maxModified + 2],
    style: common.style()
  });
  
  // populate our table
  for (var l in logz) {
    var log = logz[l];
    logs.table.push([log.name, log.size, new Date(log.modified).toString(dateFormat)]);
  }  
}

// bash completion
logs.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "logs") argv.unshift("logs");
  if (argv.length === 2) {
    var cmds = ["get", "list", "delete"];
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "get":
    case "list":
      common.getAppIds(cb); 
      break;
    default: return cb(null, []);
  }
};
