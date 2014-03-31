module.exports = connections;

connections.usage = "fhc connections [list] <project-id>";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var _ = require('underscore');
var templates = require('./templates.js');
var util = require('util');
var fs = require('fs');
var clone = require('./clone.js');
var async = require('async');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + connections.usage);
};

function connections(args, cb) {
  if (args.length === 1) return listConnections(args, cb);

  var action = args[0];
  if ("list" === action) {
    return listConnections(args, cb);
  } else {
    return unknown("Invalid action: " + action, cb);
  }
};

function listConnections(args, cb) {
  if (args.length > 2) {
    return unknown("Invalid arguments", cb);
  }

  var projectId = args[1] || args[0];
  var url = "box/api/projects/" + projectId + '/connections';

  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Connections: ", function(err, conns){
    if (err) return cb(err);

    if (ini.get('table') === true) {
      var headers = ['Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
      var fields = ['tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];
      connections.table = common.createTableFromArray(headers, fields, conns);
    }

    return cb(err, conns);
  });
};


// bash completion
connections.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "connections") argv.unshift("connections");
//  if (argv.length === 2) {
//    return cb(null, ["clone", "create", "update", "read", "delete", "list"]);
//  }
  if (argv.length === 2) {
    common.getProjectIds(cb);
  }
/*
  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "read":
      case "clone":
      case "update":
      case "delete":
        common.getProjectIds(cb);
        break;
      default: return cb(null, []);
    }
  }
*/
};