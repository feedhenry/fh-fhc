/* globals i18n */
module.exports = connections;

connections.desc = i18n._("Manage connections between client and cloud apps");
connections.usage = "fhc connections [list] <project-id>\n" +
                  "fhc connections read <project-id> <connection-id>\n" +
                  "fhc connections update <proejct-id> <connection-id> <cloud-app-id> --env=<environment>\n";

var common = require("../../common");
var fhreq = require("../../utils/request");
var ini = require('../../utils/ini');
var _ = require('underscore');
var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + connections.usage);
}

function connections(argv, cb) {
  var args = argv._;
  if (args.length === 1) return listConnections(argv, cb);

  var action = args[0];
  if ("list" === action) {
    return listConnections(argv, cb);
  }
  if ("read" === action) {
    return readConnection(argv, cb);
  }
  if ("update" === action) {
    return updateConnection(argv, cb);
  } else {
    return unknown(i18n._("Invalid action: ") + action, cb);
  }
}

function readConnection(argv, cb) {
  var args = argv._;
  if (args.length < 3) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var projectId = args[1];
  var connectionId = args[2];
  listConnections({_ : [projectId]}, function(err, conns) {
    if (err) return cb(err);
    var conn = _.findWhere(conns, {guid: connectionId});
    if (!conn) return cb(i18n._('Connection not found: ') + connectionId);

    if (ini.get('table') === true) {
      connections.table = common.createTableFromArray(headers, fields, [conn]);
    }
    return cb(err, conn);
  });
}

function listConnections(argv, cb) {
  var args = argv._;
  if (args.length > 2) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var projectId = args[1] || args[0];
  var url = "box/api/projects/" + projectId + '/connections';

  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, i18n._("Error reading Connections: "), function(err, conns){
    if (err) return cb(err);

    if (ini.get('table') === true) {
      connections.table = common.createTableFromArray(headers, fields, conns);
    }

    return cb(err, conns);
  });
}

function updateConnection(argv, cb) {
  var args = argv._;
  if (args.length < 3) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var projectId = args[1];
  var connectionId = args[2];
  var cloudApp = args[3];
  var env = ini.getEnvironment(argv);

  readConnection({_ : ['read', projectId, connectionId]}, function(err, conn) {
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
      default:
        return cb(null, []);
    }
  }
};
