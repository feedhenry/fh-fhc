/* globals i18n */

module.exports = apps;
apps.list = list;

apps.desc = i18n._("Lists applications");
apps.usage = "\nfhc apps";
apps.usage_ngui = "\nfhc apps [list] <project-id>" +
                  "\nfhc apps create <project-id> <app-title> [<template-id>]" +
                  "\nfhc apps create <project-id> <app-title> <template-type> <git-repo> [<git-branch>]" +
                  "\nfhc apps read <project-id> <app-id>" +
                  "\nfhc apps update <project-id> <app-id> <property-name> <property-value>" +
                  "\nfhc apps delete <project-id> <app-id>";

var fhc = require("../../fhc");
var common = require("../../common");
var ini = require('../../utils/ini');
var _ = require('underscore');
var fhreq = require("../../utils/request");
var create = require("../fh2/app/create.js");
var util = require('util');

// Main apps entry point
function apps (argv, cb) {
  var args = argv._,
    isNGUI = ini.get('fhversion') >= 3;
  if (isNGUI) return nguiApps(args, cb);
  else return oldApps(args, cb);
}

function nguiApps(args, cb) {
  if (args.length === 1) {
    return list(args[0], cb);
  }

  var action = args[0];
  if (action === 'read') {
    var projectId = fhc.appId(args[1]);
    var appId = fhc.appId(args[2]);
    return doRead(projectId, appId, cb);
  }else if (action === 'create'){
    args.shift();
    return create({ _: args }, cb);
  }else if (action === 'update'){
    if (args.length === 1 || args.length > 5) return cb(apps.usage_ngui);
    var projectIdToUpdate = args[1];
    var appIdToUpdate = fhc.appId(args[2]);
    var name = args[3];
    var value = args[4];
    return doUpdate(projectIdToUpdate, appIdToUpdate, name, value, cb);
  }else if (action === 'delete'){
    if (args.length !== 3){
      return cb(apps.usage_ngui);
    }
    var projectIdToDelete = args[1];
    var appIdToDelete = args[2];
    return doDelete(projectIdToDelete, appIdToDelete, cb);
  } else{
    return cb(apps.usage_ngui);
  }
}

function errorMessageString(action) {
  return util.format(i18n._("The 'fhc apps %s' command is deprecated. Please use 'fhc %s' command instead."), action, action);
}

// legacy FH2 support
function oldApps(args, cb){
  if (args.length === 0){
    return list(cb);
  }else if (args.length === 1) {
    return list(args[0], cb);
  }

  var action = args[0];
  if (action === 'read' ||
      action === 'create' ||
      action === 'delete' ||
      action === 'ping') {
    return cb(errorMessageString(action));
  } else {
    return cb(apps.usage);
  }
}

// list apps - works with old and ngui
function list(projectId, cb) {
  if (!cb) {
    cb = projectId;
    projectId = null;
  }
  var isNGUI = ini.get('fhversion') >= 3;
  common.listApps(projectId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {

      if (isNGUI) {
        var headers = ['Id', 'Title', 'Description', 'Type', 'Git', 'Branch'];
        var fields = ['guid', 'title', 'description', 'type', 'internallyHostedRepoUrl', 'scmBranch'];
        apps.table = common.createTableFromArray(headers, fields, data.list);

      }else {
        apps.table = common.createTableForApps(data.list);
      }
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) {
        filter = ini.get('bare');
      }
      apps.bare = _.chain(data.list).filter(function(app) {
        return app[filter].trim().length > 0;
      }).map(function(app) {
        return app[filter];
      }).value().join('\n');
    }
    return cb(err, data);
  });
}

// ngui property update - read the project, then update the properties
function doUpdate(projectId, appId, name, value, cb) {
  common.readApp(projectId, appId, function(err, app){
    if (err) return cb(err);
    app[name] = value;
    fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/apps/" + appId, app,  function (err, remoteData, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(raw);

      if(ini.get('table') === true && remoteData) {
        apps.table = common.createTableForAppProps(remoteData);
      }
      return cb(undefined, remoteData);
    });
  });
}

// read an app
function doRead(projectId, appId, cb) {
  common.readApp(projectId, appId, function(err, app){
    if(err) return cb(err);
    if(ini.get('table') === true && app) {
      apps.table = common.createTableForAppProps(app);
    }

    return cb(err, app);
  });
}

// delete ngui app
function doDelete(projectId, appId, cb) {
  fhreq.DELETE(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps/' + appId, function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (response.statusCode !== 200) return cb(raw);
    return cb(null, remoteData);
  });
}


// bash completion
apps.completion = function (opts, cb) {
  var isNGUI = ini.get('fhversion') >= 3;
  if (!isNGUI) return cb(null, []);

  var argv = opts.conf.argv.remain;
  if (argv[1] !== "apps") argv.unshift("apps");

  if (argv.length === 2 || argv.length === 3) {
    common.listProjects(function (err, projs) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(projs, 'guid'));
    });
  }
  if (argv.length === 4) {
    var projectId = argv[3];
    common.listApps(projectId, function(err, apps){
      if(err) return cb(null, []);
      return cb(null, _.pluck(apps.list, 'guid'));
    });
  }
};
