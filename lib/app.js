module.exports = app;

app.usage = "fhc app list"
    + "\nfhc app create <project-id>"
    + "\nfhc app delete <project-id> <app-id>"
    + "\nwhere <project-id> is a project id";
    + "\nwhere <app-id> is an app id";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');

var API_URL = "box/api/projects/<project-id>";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + app.usage);
}

function app(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var action = args[0];
  if ("list" === action) {
    return listApps(args, cb);
  } else if ("create" === action) {
    return createApp(args, cb);
  } else if ("update" === action) {
    return updateApp(args, cb);
  } else if ("delete" === action) {
    return deleteApp(args, cb);
  } else {
    return unknown("Invalid app action " + action, cb);
  }
}

function listApps(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  var projectId = fhc.appId(args[1]);
  var endpoint = API_URL.replace("<project-id>", projectId);
  console.log(endpoint);

  common.doGetApiCall(fhreq.getFeedHenryUrl(), endpoint, "Error reading apps: ", function (err, data) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      app.table = common.createTableForProjectApps(projectId, data.apps);
    }
    return cb(err, data);
  });
}

function createApp(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var endpoint = API_URL.replace("<project-id>", fhc.appId(args[1])) + "/apps";
  console.log(endpoint);

  var title = args[2];
  var type = args[3] || "client_hybrid";
  console.log(title);
  var params =  {
    title: title,
    template: {"type" : type}
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), endpoint, params, "Error creating app: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function deleteApp(args, cb) {
  if (args.length < 3) {
    return unknown("Invalid arguments", cb);
  }

  var endpoint = API_URL.replace("<project-id>", fhc.appId(args[1])) + "/apps/" + fhc.appId(args[2]);
  console.log(endpoint);

  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  "Error deleting app: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}