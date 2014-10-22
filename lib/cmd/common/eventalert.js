
module.exports = eventalert;
eventalert.usage = "fhc eventalert listOptions"
  + "\nfhc eventalert create <appid> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses --env=<environment>"
  + "\nfhc eventalert clone <alertId>"
  + "\nfhc eventalert delete <alertId>"
  + "\nfhc eventalert list <appId>"
  + "\nfhc eventalert read <alertId>"
  + "\nfhc eventalert read <appid> alertName"
  + "\nfhc eventalert update <alertId> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses"
  + "\nFor the valid values for eventCategories, eventSeverities and eventNames, please run 'fhc eventalert listOptions' to see the full list";

eventalert.url_eventAlertCreate = "/box/srv/1.1/cm/eventlog/alert/create";
eventalert.url_eventAlertUpdate = "/box/srv/1.1/cm/eventlog/alert/update";
eventalert.url_eventAlertRead = "/box/srv/1.1/cm/eventlog/alert/read";
eventalert.url_eventAlertList = "/box/srv/1.1/cm/eventlog/alert/list";
eventalert.url_eventAlertDelete = "/box/srv/1.1/cm/eventlog/alert/delete";
eventalert.url_eventAlertclone = "/box/srv/1.1/cm/eventlog/alert/clone";
eventalert.url_eventAlertTestEmails = "/box/srv/1.1/cm/eventlog/alert/testEmails";
eventalert.url_eventAlertListOptions = "/box/srv/1.1/cm/eventlog/alert/listOptions";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main secureendpoints entry point
function eventalert (args, cb) {
  var target = ini.getEnvironment(args);

  if (args.length < 1) return cb("Invalid arguments:" + eventalert.usage);

  var action =  args[0];
  var id;
  if(args.length > 1){
    id = args[1];
  }

  var argsRemainder;
  var parsedArgs;

  if (args.length > 2) {
    var alertName = args[2];
    if (args.length > 3) {
      argsRemainder = args.slice(3);
      parsedArgs = common.parseArgs(argsRemainder);
    }
  }

  //need to validate args types for each action
  if (action === 'create') {
    if (args.length < 3) return cb("Invalid arguments for 'create':" + eventalert.usage);
    return createEventAlert(id, alertName, parsedArgs, target, cb);
  } else if (action === 'update') {
    if (args.length < 3) return cb("Invalid arguments for 'clone':" + eventalert.usage);
    return updateAlert(id, alertName, parsedArgs, target, cb);
  } else if (action === 'clone') {
    if (args.length !== 2) return cb("Invalid arguments for 'clone':" + eventalert.usage);
    return cloneAlert(id, cb);
  } else if (action === 'delete') {
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + eventalert.usage);
    return deleteAlert(id, cb);
  } else if (action === 'read') {
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + eventalert.usage);
    return readAlert(id, cb);
  } else if (action === 'list') {
    if (args.length !== 2) return cb("Invalid arguments for 'list':" + eventalert.usage);
    return listAlert(id, target, cb);
  } else if (action === "listOptions") {
    return listOptions(cb);
  } else {
    return cb("Unknown command '" + action + "'. Usage: " + eventalert.usage);
  }
};

function createEventAlert(id, alertName, parsedArgs, env, cb) {
  var payload = {
    "uid": id,
    "alertName": alertName,
    "env": env
  };
  if (parsedArgs && parsedArgs.categories) {
    payload["eventCategories"] = parsedArgs.categories;
  }
  if (parsedArgs && parsedArgs.severities) {
    payload["eventSeverities"] = parsedArgs.severities;
  }
  if (parsedArgs && parsedArgs.events) {
    payload["eventNames"] = parsedArgs.events;
  }
  if (parsedArgs && parsedArgs.emails) {
    payload["emails"] = parsedArgs.emails;
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertCreate, payload, "Error creating alert: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function updateAlert(id, alertName, parsedArgs, env, cb) {
  var payload = {
    "guid": id,
    "alertName": alertName,
    "env": env
  };
  if (parsedArgs && parsedArgs.categories) {
    payload["eventCategories"] = parsedArgs.categories;
  }
  if (parsedArgs && parsedArgs.severities) {
    payload["eventSeverities"] = parsedArgs.severities;
  }
  if (parsedArgs && parsedArgs.events) {
    payload["eventNames"] = parsedArgs.events;
  }
  if (parsedArgs && parsedArgs.emails) {
    payload["emails"] = parsedArgs.emails;
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertUpdate, payload, "Error creating alert: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function cloneAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertclone, payload, "Error cloning alert: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function deleteAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertDelete, payload, "Error deleting alert: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function readAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertRead, payload, "Error deleting alert: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listAlert(id, env, cb) {
  var payload = {
    "uid": id,
    "env": env
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertList, payload, "Error listing alerts: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listOptions(cb){
  var payload = {};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertListOptions, payload, "Error listing alert options: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function getEventAlertList(appOrDomain, id, env, cb) {
  var payload = {scope: appOrDomain, id: id, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventLogManageList, payload, "Error getting events list: ", function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true) {
      if(data.list) {
        eventalert.message = eventalert.message + "\nCloud Events List:";
        eventalert.table = createTableEventAlertList(data.list);
      }
    }
    return cb(undefined, data);
  });
}

function createTableEventAlertList(entries) {
//level, event, enabled, environment, emails

  // calculate widths
  var maxLevel=7, maxEvent=11, maxEnabled=5, maxEnvironment=4, maxEmails=15;

  for (var i=0; i<entries.length; i++) {
    var entry = entries[i];
    if(common.strlen(entry.level) > maxLevel) maxLevel = common.strlen(entry.level);
    if(common.strlen(entry.event) > maxEvent) maxEvent = common.strlen(entry.event);
    if(common.strlen(entry.enabled) > maxEnabled) maxEnabled = common.strlen(entry.enabled);
    if(common.strlen(entry.environment) > maxEnvironment) maxEnvironment = common.strlen(entry.environment);
    if(common.strlen(entry.emails) > maxEmails) maxEmails = common.strlen(entry.emails);
  }

  // create our table
  var table = new Table({
    head: ['Level', 'Event', 'Enabled', 'Environment', 'Emails'],
    colWidths: [maxLevel +2 , maxEvent + 2, maxEnabled + 2, maxEnvironment + 2, maxEmails + 2],
    style: common.style()
  });

  // populate our table
  for (var i=0; i<entries.length; i++) {
    var entry = entries[i];
    table.push([entry.level, entry.event, entry.enabled, entry.environment, entry.emails]);
  }
  return table;
}

// bash completion
eventalert.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;

  if (argv[1] !== "eventalert") argv.unshift("eventalert");

  if (argv.length === 2) {
    var cmds = ["create", "clone", "delete", "list", "read", "update"];
    return cb(undefined, cmds);
  }

  if ((argv.length === 3) && ((argv[2] === 'create') || (argv[2] === 'list') || (argv[2] === 'read'))) {
    return common.getAppIds(cb);
  }

  return cb();
};
