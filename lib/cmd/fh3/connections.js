module.exports = connections;

connections.desc = "Manage connections between client and cloud apps";
connections.usage = "fhc connections [list] <project-id>\n"
                  + "fhc connections read <project-id> <connection-id>\n"
                  + "fhc connections update <proejct-id> <connection-id> <cloud-app-id> --env=<environment>\n";

var log = require("../../utils/log");
var common = require("../../common");
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require('../../utils/ini');
var _ = require('underscore');
var templates = require('../common/templates.js');
var util = require('util');
var fs = require('fs');
var clone = require('../common/clone.js');
var async = require('async');
var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + connections.usage);
}

function connections(argv, cb) {
  var args = argv._;
  if (args.length === 1) return listConnections(args, cb);

  var action = args[0];
  if ("list" === action) {
    return listConnections(args, cb);
  } if ("read" === action) {
    return readConnection(args, cb);
  } if ("update" === action) {
    return updateConnection(args, cb);
  } else {
    return unknown("Invalid action: " + action, cb);
  }
}

function readConnection(args, cb) {
  if (args.length < 3) {
    return unknown("Invalid arguments", cb);
  }

  var projectId = args[1];
  var connectionId = args[2];
  listConnections([projectId], function(err, conns) {
    if (err) return cb(err);
    var conn = _.findWhere(conns, {guid: connectionId});
    if (!conn) return cb('Connection not found: ' + connectionId);

    if (ini.get('table') === true) {
      connections.table = common.createTableFromArray(headers, fields, [conn]);
    }
    return cb(err, conn);
  });
}

function listConnections(args, cb) {
  if (args.length > 2) {
    return unknown("Invalid arguments", cb);
  }

  var projectId = args[1] || args[0];
  var url = "box/api/projects/" + projectId + '/connections';

  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Connections: ", function(err, conns){
    if (err) return cb(err);

    if (ini.get('table') === true) {
      connections.table = common.createTableFromArray(headers, fields, conns);
    }

    return cb(err, conns);
  });
}

function updateConnection(args, cb) {
  if (args.length < 3) {
    return unknown("Invalid arguments", cb);
  }

  var projectId = args[1];
  var connectionId = args[2];
  var cloudApp = args[3];
  var env = ini.getEnvironment(args);

  readConnection(['read', projectId, connectionId], function(err, conn) {
    if (err) return cb(err);
    conn.cloudApp = cloudApp;
    conn.environment = env;
    var url = 'box/api/connections/' + connectionId;
    fhreq.PUT(fhreq.getFeedHenryUrl(), url, conn, function (err, con, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(raw);

      if (ini.get('table') === true) {
        connections.table = common.createTableFromArray(headers, fields, [con]);
      }

      return cb(null, con);
    });
  });
}

// bash completion
connections.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "connections") argv.unshift("connections");
  if (argv.length === 2) {
    return cb(null, ["list", "update"]);
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "list":
      case "read":
      case "update":
        common.getProjectIds(cb);
        break;
      default: return cb(null, []);
    }
  }
};
