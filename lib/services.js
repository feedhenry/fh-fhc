module.exports = services;

services.usage = "fhc services [list]"
    + "\nfhc services create <service-id> [<type>]"
    + "\nfhc services delete <service-id>"
    + "\nwhere <services-id> is a services id"
    + "\nwhere <type> is a valid services type [default]";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var util = require('util');

// TODO - refactor this in millicore
var API_URL = "box/api/connectors";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + services.usage);
}

function services(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var action = args[0];
  if ("list" === action) {
    return listServices(args, cb);
  } else if ("create" === action) {
    return createService(args, cb);
  } else if ("update" === action) {
    return updateService(args, cb);
  } else if ("delete" === action) {
    return deleteService(args, cb);
  } else {
    return unknown("Invalid services action " + action, cb);
  }
}

function listServices(args, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), API_URL, "Error reading servicess: ", function (err, data) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      services.table = common.createTableForProjects(data);
    }
    return cb(err, data);
  });
}

function createService(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var title = args[1];
  var type = args[2] || "default";
  var params =  {
    title: title,
    template: {"type" : type}
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), API_URL, params, "Error creating services: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function updateService(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  cb()
}

function deleteService(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  var endpoint = API_URL + "/" + fhc.appId(args[1]);
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  "Error deleting services: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}