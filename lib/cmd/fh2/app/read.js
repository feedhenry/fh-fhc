/* globals i18n */

module.exports = read;
read.read = read;

read.usage = "fhc app read <app-id>";
read.usageNgui = "fhc app read [project-id] <app-id>";

var fhc = require("../../../fhc");
var common = require("../../../common");
var ini = require('../../../utils/ini');
var _ = require('underscore');

// Main read entry point
function read(argv, cb) {
  var args = argv._;
  var appId;
  if (args.length === 0) {
    return cb(read.usage);
  }

  if (args.length === 1) {
    appId = fhc.appId(args[0]);
    return doRead(null, appId, cb);
  }

  var projectId = fhc.appId(args[0]);
  appId = fhc.appId(args[1]);
  return doRead(projectId, appId, cb);
}

// read an app
function doRead(projectId, appId, cb) {
  if (!cb) {
    appId = projectId;
    cb = appId;
    projectId = null;
  }

  if (!appId) {
    return cb(i18n._("No appId specified!") + ' ' + i18n._("Usage:\n") + read.usage);
  }

  common.readApp(projectId, appId, function(err, app) {
    if(err) {
      return cb(err);
    }
    if(ini.get('table') === true && app) {
      read.table = common.createTableForAppProps(app);
    }

    return cb(err, app);
  });
}

// bash completion
read.completion = function(opts, cb) {
  var isNGUI = ini.get('fhversion') >= 3;
  if (!isNGUI) {
    return common.getAppIds(cb);
  }

  var argv = opts.conf.argv.remain;
  if (argv[1] !== "read") {
    argv.unshift("read");
  }
  if (argv.length === 2) {
    common.listProjects(function(err, projs) {
      if (err) {
        return cb(null, []);
      }
      return cb(null, _.pluck(projs, 'guid'));
    });
  }
  if (argv.length === 3) {
    var projectId = argv[2];
    common.listApps(projectId, function(err, apps) {
      if(err) {
        return cb(null, []);
      }
      return cb(null, _.pluck(apps.list, 'guid'));
    });
  }
};
