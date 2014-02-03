module.exports = clone;

clone.usage = [
  "fhc clone <project_id>" +
  "\nwhere <project-id> is a project id"
];

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var prompt = require('prompt');

var PROJECT_API_URL = "box/api/projects";

function gitAvailable(cb) {
  // TODO: Windows?
  var util = require('util');
  var exec = require('child_process').exec;
  exec('git --version', function(err, stdout, stderr) {
    if (stderr) return cb(false);
    return cb(true);
  });
}

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + clone.usage);
}

function clone(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var project_id = args[0];
  if (project_id !== "") {
    return cloneProject(args, cb);
  } else {
    return unknown("Invalid project id for clone.", cb);
  }
}

function cloneProject(args, cb) {
  gitAvailable(function(available) {
    if (!available) return cb("Git is not installed. Visit http://git-scm.com/ for installation instructions.");

    common.doGetApiCall(fhreq.getFeedHenryUrl(), PROJECT_API_URL, "Error reading projects: ", function(err, data) {
      if (err) return cb(err);

      console.log(data);



      // if (ini.get('table') === true) {
      //   projects.table = common.createTableForProjects(data);
      // }
      return cb(err, "");
    });
  });
}