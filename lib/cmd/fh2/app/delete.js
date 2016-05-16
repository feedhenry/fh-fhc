/* globals i18n */
module.exports = deletes;
deletes.delete = deletes;

deletes.desc = i18n._("Deletes a FeedHenry app");
deletes.usage = "fhc app delete <app-id>";
deletes.usage_ngui = "fhc app delete <project-id> <app-id>";

var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var async = require('async');
var ini = require('../../../utils/ini');
var _ = require('underscore');

// Main deletes entry point
function deletes(argv, cb) {
  var args = argv._,
    isNGUI = ini.get('fhversion') >= 3;

  if (args.length === 0) {
    return cb(isNGUI ? deletes.usage_ngui : deletes.usage);
  }
  var appId;
  if (isNGUI) {
    var projectId = args.shift();
    appId = args;
    return deleteApps(projectId, appId, deleteNguiApp, cb);
  } else {
    appId = fhc.appId(args);
    return deleteApps(null, appId, deleteApp, cb);
  }
}

// delete app - projectId unused for non-ngui apps
function deleteApp(projectId, appId, cb) {
  var payload = {
    payload: {
      confirmed: "true",
      guid: appId
    },
    context: {}
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/delete", payload, i18n._("Error deleting app: "), function (err, data) {
    if (err) return cb(err);
    if (data.inst && data.inst.title) {
      if (!deletes.message) deletes.message = "";
      deletes.message = deletes.message + i18n._("Deleted: ") + data.inst.id + ' - ' + data.inst.title + "\n";
    }

    return cb(err, data);
  });
}

// delete ngui app
function deleteNguiApp(projectId, appId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps/' + appId, function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (response.statusCode !== 200) return cb(raw);
    return cb(null, remoteData);
  });
}

// delete multiple apps
function deleteApps(projectId, appId, deleteAppFunc, cb) {
  var appIds = [];
  appIds = 'string' === typeof appId ? [appId] : appId;

  function wrapper(appId, wcb) {
    deleteAppFunc(projectId, appId, wcb);
  }

  async.map(appIds, wrapper, cb);
}

// bash completion
deletes.completion = function (opts, cb) {
  var isNGUI = ini.get('fhversion') >= 3;
  if (!isNGUI) return common.getAppIds(cb);

  var argv = opts.conf.argv.remain;
  if (argv[1] !== "delete") argv.unshift("delete");
  if (argv.length === 2) {
    common.listProjects(function (err, projs) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(projs, 'guid'));
    });
  }
  if (argv.length === 3) {
    var projectId = argv[2];
    common.listApps(projectId, function (err, apps) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(apps.list, 'guid'));
    });
  }
};
