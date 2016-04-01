/* globals i18n */
module.exports = logs;
logs.logs = logs;
logs.listLogs = listLogs;
logs.getLogs = getLogs;
logs.desc = i18n._("Cloud application log Files");
logs.usage = "\nfhc app logs [get] <app-id> [log-name] --env=<environment>"
  + "\nfhc app logs tail <app-id> [last-N-lines] [offset-from] [log-name] --env=<environment>"
  + "\nfhc app logs list <app-id> --env=<environment>"
  + "\nfhc app logs delete <app-id> <log-name> --env=<environment>"
  + "\n"
  + i18n._("\n Note: log tail defaults to the current std-out log file & display last 1000 lines of log file")
  + i18n._("\n       To specify an offset, pass -1 for the last-N-lines param - e.g. ")
  + "\n           log tail -1 12345"
  + i18n._("\n       This will return all log entries from position 12345 onwards");
var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var common = require("../../../common");
var ini = require('../../../utils/ini');
var fhreq = require("../../../utils/request");
var Table = require('cli-table');
var _ = require('underscore');

// main logs entry point
function logs(argv, cb) {
  var args = argv._;
  if (args.length < 1) {
    return cb(logs.usage);
  }
  var target = ini.getEnvironment(argv);


  // Otherwise look for an action
  var action = args[0];
  var appId;
  var logName;
  if (action === "get") {
    if (!args[1]) {
      return cb(logs.usage);
    }
    appId = fhc.appId(args[1]);
    logName = args[2];
    return getLogs(appId, logName, target, cb);
  } else if (action === "tail") {
    if (!args[1]) {
      return cb(logs.usage);
    }
    appId = fhc.appId(args[1]);
    var last = args[2];
    var offset = args[3];
    logName = args[4];
    return tailLog(process.stdout, appId, last, offset, logName, target, cb);
  } else if (action === "list") {
    if (!args[1]) {
      return cb(logs.usage);
    }
    appId = fhc.appId(args[1]);
    return listLogs(appId, target, cb);
  } else if (action === "delete") {
    if (!args[1]) {
      return cb(logs.usage);
    }
    if (!args[2]) {
      return cb(logs.usage);
    }
    appId = fhc.appId(args[1]);
    return deleteLog(appId, args[2], target, cb);
  } else {
    // assume all params are for get
    appId = fhc.appId(action);
    if (appId.length !== 24) return cb(logs.usage);
    logName = args[1];
    return getLogs(appId, logName, target, cb);
  }
}

// get our log files
function listLogs(appId, target, cb) {
  var payload = {payload: {guid: appId, deploytarget: target, action: 'list'}};
  log.silly(payload, 'Listing logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/logs", payload, i18n._("Error getting logs: "), function (err, data) {
    if (err) {
      return cb(err);
    }
    if (ini.get('table') === true) {
      createTableForLogs(data.logs);
    }
    return cb(err, data);
  });
}

// get list of log files
function getLogs(appId, logName, target, cb) {
  var payload = {payload: {guid: appId, deploytarget: target, logname: logName, 'action': 'get'}};
  log.silly(payload, 'Getting logs');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/logs", payload, "", function (err, data) {
    if (err) {
      return cb(err);
    }
    log.silly(data, "Response log");
    if (!logName) {
      // backward compatability..
      var lg = data.log ? data.log : data.logs;
      var logData = "\n====> stdout <====\n" + lg.stdout + "\n====> stderr <====\n" + lg.stderr;
      logs.message = logData;
    } else {
      logs.message = data.log.contents === '' ? '<empty>' : data.log.contents;
    }
    return cb(err, data);
  });
}

// delete log file
function deleteLog(appId, logName, target, cb) {
  var payload = {payload: {guid: appId, deploytarget: target, action: 'delete', logname: logName}};
  log.silly(payload, 'Deleting log');
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/logs", payload, i18n._("Error deleting log: "), function (err, data) {
    if (err) {
      return cb(err);
    }
    logs.message = JSON.parse(data.msg);
    return cb(err, data);
  });
}

// put our logs into table format..
function createTableForLogs(logz) {
  // calculate widths
  var dateFormat = "ddd MMM dd yyyy HH:mm:ss";

  // create our table
  logs.table = new Table({
    head: ['Name', 'Size', 'Modified'],
    style: common.style()
  });

  // populate our table
  _.each(logz, function (log) {
    logs.table.push([log.name, log.size, new Date(log.modified).toString(dateFormat)]);
  });
}

function tailLog(stream, appName, last, offset, logName, target, cb) {
  var payload = {
    "guid": appName,
    "action": "chunk",
    "deploytarget": target
  };

  if (last) {
    payload.last = last;
  }
  if (offset) {
    payload.offset = offset;
  }
  if (logName) {
    payload.logname = logName;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/logchunk", payload, "", function (err, res) {
    if (err) {
      return cb(err);
    }

    var lastOffset = res.msg ? res.msg.offset : undefined;
    if ("undefined" === typeof(lastOffset)) {
      return cb(i18n._("offset undefined"));
    }

    if (res.msg.data.length > 0) {
      stream.write(res.msg.data.join("\n") + "\n");
    }

    // Check for new logs every 1 second
    setTimeout(function () {
      tailLog(stream, appName, undefined, lastOffset, logName, target, function (err) {
        if (err) {
          return cb(err);
        }
      });
    }, 1000);
  });
}

// bash completion
logs.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "logs") {
    argv.unshift("logs");
  }
  if (argv.length === 2) {
    var cmds = ["get", "list", "delete"];
    return cb(undefined, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "get":
    case "list":
      common.getAppIds(cb);
      break;
    default:
      return cb(undefined, []);
  }
};
