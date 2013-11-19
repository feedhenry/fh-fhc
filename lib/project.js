module.exports = project;

project.usage = "fhc project list"
    + "\nfhc project create <project-id>"
    + "\nfhc project delete <project-id>"
    + "\nwhere <project-id> is a project id";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');

var VALID_PROJECT_ACTIONS = ["create", "list", "update", "delete"];
var API_URL = "box/api/projects";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + project.usage);
}

function project(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var action = args[0];
  if ("list" === action) {
    return listProjects(args, cb);
  } else if ("create" === action) {
    return createProject(args, cb);
  } else if ("update" === action) {
    return updateProject(args, cb);
  } else if ("delete" === action) {
    return deleteProject(args, cb);
  } else {
    return unknown("Invalid project action " + action, cb);
  }
}

function listProjects(args, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), API_URL, "Error reading projects: ", function (err, data) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      project.table = common.createTableForProjects(data);
    }
    return cb(err, data);
  });
}

function createProject(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var title = args[1];
  var type = args[2] || "default";
  console.log(title);
  var params =  {
    title: title,
    template: {"type" : type}
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), API_URL, params, "Error creating project: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function updateProject(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  cb()
}

function deleteProject(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  var endpoint = API_URL + "/" + fhc.appId(args[1]);
  console.log(endpoint);
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  "Error deleting project: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}