/* globals i18n */
module.exports = eventalert;
eventalert.desc = i18n._("Manage alerts of a FeedHenry App");
eventalert.usage = "fhc eventalert listOptions"
  + "\nfhc eventalert create <appid> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses --env=<environment>"
  + "\nfhc eventalert clone <alertId>"
  + "\nfhc eventalert delete <alertId>"
  + "\nfhc eventalert list <appId>"
  + "\nfhc eventalert read <alertId>"
  + "\nfhc eventalert read <appid> alertName"
  + "\nfhc eventalert update <alertId> alertName categories=eventCategories severities=eventSeverities events=eventNames emails=emailAddresses"
  + i18n._("\nFor the valid values for eventCategories, eventSeverities and eventNames, please run 'fhc eventalert listOptions' to see the full list");

eventalert.url_eventAlertCreate = "/box/srv/1.1/cm/eventlog/alert/create";
eventalert.url_eventAlertUpdate = "/box/srv/1.1/cm/eventlog/alert/update";
eventalert.url_eventAlertRead = "/box/srv/1.1/cm/eventlog/alert/read";
eventalert.url_eventAlertList = "/box/srv/1.1/cm/eventlog/alert/list";
eventalert.url_eventAlertDelete = "/box/srv/1.1/cm/eventlog/alert/delete";
eventalert.url_eventAlertclone = "/box/srv/1.1/cm/eventlog/alert/clone";
eventalert.url_eventAlertTestEmails = "/box/srv/1.1/cm/eventlog/alert/testEmails";
eventalert.url_eventAlertListOptions = "/box/srv/1.1/cm/eventlog/alert/listOptions";

var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');
var util = require('util');

function errorMessageString(action) {
  return util.format(i18n._("Invalid arguments for '%s':"), action);
}

// Main secureendpoints entry point
function eventalert(argv, cb) {
  var args = argv._;
  var target = ini.getEnvironment(argv);

  if (args.length < 1) return cb(i18n._("Invalid arguments:") + eventalert.usage);

  var action = args[0];
  var id;
  if (args.length > 1) {
    id = args[1];
  }

  var argsRemainder;
  var parsedArgs;
  var alertName;
  if (args.length > 2) {
    alertName = args[2];
    if (args.length > 3) {
      argsRemainder = args.slice(3);
      parsedArgs = common.parseArgs(argsRemainder);
    }
  }

  //need to validate args types for each action
  if (action === 'create') {
    if (args.length < 3) return cb(errorMessageString(action) + eventalert.usage);
    return createEventAlert(id, alertName, parsedArgs, target, cb);
  } else if (action === 'update') {
    if (args.length < 3) return cb(errorMessageString(action) + eventalert.usage);
    return updateAlert(id, alertName, parsedArgs, target, cb);
  } else if (action === 'clone') {
    if (args.length !== 2) return cb(errorMessageString(action) + eventalert.usage);
    return cloneAlert(id, cb);
  } else if (action === 'delete') {
    if (args.length !== 2) return cb(errorMessageString(action) + eventalert.usage);
    return deleteAlert(id, cb);
  } else if (action === 'read') {
    if (args.length !== 2) return cb(errorMessageString(action) + eventalert.usage);
    return readAlert(id, cb);
  } else if (action === 'list') {
    if (args.length !== 2) return cb(errorMessageString(action) + eventalert.usage);
    return listAlert(id, target, cb);
  } else if (action === "listOptions") {
    return listOptions(cb);
  } else {
    return cb(util.format(i18n._("Unknown command '%s'."), action) + ' ' + i18n._("Usage: ") + eventalert.usage);
  }
}

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
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertCreate, payload, i18n._("Error creating alert: "), function (err, data) {
    if (err) return cb(err);
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
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertUpdate, payload, i18n._("Error creating alert: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function cloneAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertclone, payload, i18n._("Error cloning alert: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function deleteAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertDelete, payload, i18n._("Error deleting alert: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function readAlert(id, cb) {
  var payload = {
    "guid": id
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertRead, payload, i18n._("Error deleting alert: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function listAlert(id, env, cb) {
  var payload = {
    "uid": id,
    "env": env
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertList, payload, i18n._("Error listing alerts: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
}

function listOptions(cb) {
  var payload = {};
  common.doApiCall(fhreq.getFeedHenryUrl(), eventalert.url_eventAlertListOptions, payload, i18n._("Error listing alert options: "), function (err, data) {
    if (err) return cb(err);
    return cb(undefined, data);
  });
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
