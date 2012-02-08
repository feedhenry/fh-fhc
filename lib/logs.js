
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

// main logs entry point
function logs(args, cb) { 
  if (args.length < 1) return cb(logs.usage);
  var target = ini.get('live') ? 'live' : 'development';  
 
  // hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'development') {
    target = args[args.length -1];
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
    var msg = "";
    for (var i=0; i<data.logs.length; i++) {
      var log = data.logs[i];
      msg = msg + log.name + "\n";
    }
    if (data.logs[0]) {
      msg = msg + "\nYou can retrieve individual log files by calling 'fhc logs get', e.g. fhc logs get " + appId + " " + data.logs[0].name;
    }
    logs.message = msg;
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
