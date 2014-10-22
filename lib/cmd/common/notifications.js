module.exports = notifications;
notifications.usage = "fhc notifications [list] <app-guid> --env=<environment> ";

var fhc = require("../../fhc");
var common = require("../../common");
var fhreq = require("../../utils/request");
var ini = require('../../utils/ini');

// Main update entry point
function notifications (args, cb) {
  if (args.length === 0) return cb(notifications.usage);

  if (args.length === 1){
    return doList(fhc.appId(args[0]), cb);
  } else {
    var act = args[0];
    if(act === "list"){
      return doList(fhc.appId(args[1]), cb);
    } else {
      return cb(notifications.usage);
    }
  }
}

function doList(appId, cb){
  return listEventLogs(appId, false, cb);
}

function doAuditLog(appId, cb){
  return listEventLogs(appId, true, cb);
}

function listEventLogs(appId, audit, cb){
  if(!appId){
    return cb("No app guid specified. Usage: " + notifications.usage);
  }
  var env = ini.getEnvironment();
  var uri = "box/srv/1.1/app/eventlog/listEvents";
  var payload = {appGuid: appId, eventGroup:"NOTIFICATION", env: env};
  if(audit){
    payload.audit = true;
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error getting event logs for app: ", function(err, data) {
    if(err) return cb(err);
    if(ini.get('table') === true && data.list) {
      notifications.table = common.createTableForNotifications(data.list);
    }
    return cb(undefined, data);
  });
}

function doDismiss(appId, notificationGuids, cb){
  if(!appId){
    return cb("No app guid specified. Usage: " + notifications.usage);
  }
  var uri = "box/srv/1.1/app/eventlog/dismissEvents";
  var payload = {appGuid: appId, eventGuids: notificationGuids};
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error dismissing event logs for app: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
notifications.completion = function (opts, cb) {
  common.getAppIds(cb);
};
