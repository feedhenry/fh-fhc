/* globals i18n */
module.exports = df;
df.pingVersion = pingVersion;
df.apps = apps;
df.logs = logs;

df.desc = i18n._("DynoFarm commands");
df.usage = "\nfhc df ping"
  + "\nfhc df version"
  + "\nfhc df apps"
  + "\nfhc df logs <app-name>"
  + "\nfhc df start <app-name>"
  + "\nfhc df restart <app-name>"
  + "\nfhc df stop <app-name>"
  + "\nfhc df delete <app-name>"
  + "\nfhc df target";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var util = require('util');
var request = require('request');
var common = require('../../common.js');
var Table = require('cli-table');
var ini = require('../../utils/ini');
var async = require('async');
var _ = require('underscore');

// main DynoFarm entry point
// note app-name here is the DF app name, not the Millicore guid (i.e. we talk directly to DF)
function df(argv, cb) {
  var args = argv._;
  var action = args.shift();
  if (action === "ping") {
    return pingVersion("ping", cb);
  } else if (action === "version") {
    return pingVersion("version", cb);
  } else if (action === "apps" || action === "ls") {
    return apps(cb);
  } else if (action === "logs") {
    if (args.length !== 1) {
      return unknown("logs", cb);
    }
    return logs(args[0], cb);
  } else if (action === "stop") {
    if (args.length !== 1) {
      return unknown("stop", cb);
    }
    return stop(args[0], cb);
  } else if (action === "start") {
    if (args.length !== 1) {
      return unknown("start", cb);
    }
    return start(args[0], cb);
  } else if (action === "restart") {
    if (args.length !== 1) {
      return unknown("restart", cb);
    }
    return restart(args[0], cb);
  } else if (action === "delete") {
    if (args.length < 1) {
      return unknown("delete", cb);
    }
    return deleteApps(args, cb);
  } else if (action === "target") {
    return cb(undefined, getDynoFarmUrl());
  }
  return unknown(action, cb);
}

// ping
function pingVersion(pingCommandVersion, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "sys/info/" + pingCommandVersion, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
}

// put our apps into table format..
function createTableForApps(apps) {
  // create our table
  df.table = new Table({
    head: ['Title', 'Name', 'Url', 'Email', 'Port', 'State'],
    style: common.style()
  });

  // populate our table
  _.each(apps, function (app) {
    df.table.push([app.title, app.appname, app.url, app.email, app.port || '-', app.state]);
  });
}

// DynoFarm apps
function apps(cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "apps", function (err, response, body) {
    if (err) return cb(common.nullToUndefined(err));
    var apps;
    try {
      apps = JSON.parse(body);
    } catch (x) {
      return cb(i18n._("Error parsing apps: ") + util.inspect(x, true, null) + " body: " + util.inspect(body));
    }

    if (ini.get('table') === true) {
      createTableForApps(apps);
    }

    return cb(undefined, apps);
  });
}

function logs(appName, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "logs/" + appName, function (err, response, body) {
    if (err) {
      return cb(err);
    }
    return cb(undefined, body);
  });
}

function stop(appName, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "stop/" + appName, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
}

// Start app
function start(appName, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "start/" + appName, function (err, response, body) {
    if (err) {
      return cb(err);
    }

    var app;
    try {
      app = JSON.parse(body);
    } catch (x) {
      log.error(i18n._("Error parsing: ") + body);
      return cb(x);
    }

    if (ini.get('table') === true) {
      df.table = common.createObjectTable(app);
    }

    return cb(undefined, app);
  });
}

function restart(appName, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest(getDynoFarmUrl() + "restart/" + appName, function (err, response, body) {
    if (err) {
      return cb(err);
    }
    if (response.statusCode !== 200) {
      return cb(i18n._("Bad response: ") + response.statusCode + " " + util.inspect(body));
    }

    var app;
    try {
      app = JSON.parse(body);
    } catch (x) {
      return cb(i18n._("Error parsing app: ") + util.inspect(body) + " error: " + util.inspect(x));
    }

    if (ini.get('table') === true) {
      df.table = common.createObjectTable(app);
    }

    return cb(common.nullToUndefined(err), app);
  });
}

function unknown(action, cb) {
  var msg = action ? i18n._("Wrong arguments for or unknown action: ") + action + "\n" : "";
  msg += i18n._("Usage:\n") + df.usage;
  cb(msg);
}

// get our DF endpoint
function getDynoFarmUrl() {
  var r = fhc.config.get("dynofarm");
  if (!r) {
    return new Error(i18n._("Must define DynoFarm URLs before accessing FeedHenry DynoFarm Server."));
  }
  if (r.substr(-1) !== "/") {
    r += "/";
  }
  fhc.config.set("dynofarm", r);
  return r;
}

// delete an app
function deleteApp(appName, cb) {
  var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
  proxyRequest({url: getDynoFarmUrl() + "delete/" + appName, method: 'POST'}, function (err, response, body) {
    return cb(common.nullToUndefined(err), body);
  });
}

function deleteApps(apps, cb) {
  async.map(apps, deleteApp, cb);
}

// bash completion
df.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "df") {
    argv.unshift("df");
  }
  if (argv.length === 2) {
    var cmds = ["apps", "logs", "start", "stop", "delete", "restart", "version"];
    return cb(undefined, cmds);
  }
  return cb(undefined, []);
};
