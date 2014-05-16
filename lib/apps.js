
module.exports = apps;
apps.list = list;

apps.usage = "\nfhc apps";
apps.usage_ngui = "\nfhc apps [list] <project-id>" +
                  "\nfhc create <project-id> <app-title> [<template-id>]" +
                  "\nfhc create <project-id> <app-title> <template-type> <git-repo> [<git-branch>]" +
                  "\nfhc read <project-id> <app-id>" +
                  "\nfhc update <project-id> <app-id> <property-name> <property-value>" +
                  "\nfhc delete <project-id> <app-id>";

var log = require("./utils/log");
var fhc = require("./fhc");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var ini = require('./utils/ini');
var Table = require('cli-table');
var _ = require('underscore');
var ngui = require('./ngui.js');
var templates = require('./templates.js');
var fhreq = require("./utils/request");
var create = require("./create.js");

// Main apps entry point
function apps (args, cb) {
  ngui([], function(err, isNGUI) {
    if (err) return cb(err);
    if (isNGUI) return nguiApps(args, cb);
    else return oldApps(args, cb);
  });
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
    return create(args, cb);
  }else if (action === 'update'){
    if (args.length === 1 || args.length > 5) return cb(apps.usage_ngui);
    var projectId = args[1];
    var appId = fhc.appId(args[2]);
    var name = args[3];
    var value = args[4];
    return doUpdate(projectId, appId, name, value, cb);
  }else if (action === 'delete'){
    if (args.length !== 3){
      return cb(apps.usage_ngui);
    }
    var projectId = args[1];
    var appId = args[2];
    return doDelete(projectId, appId, cb);
  } else{
    return cb(apps.usage_ngui);
  }
}

// legacy FH2 support
function oldApps(args, cb){
  if (args.length === 0){
    return list(cb);
  }else if (args.length === 1) {
    return list(args[0], cb);
  }

  var action = args[0];
  if (action === 'read') {
    return cb("The 'fhc apps read' command is deprecated. Please use 'fhc read' command instead.");
  }else if (action === 'create'){
    return cb("The 'fhc apps create' command is deprecated. Please use 'fhc create' command instead.");
  }else if (action === 'update'){
    return cb("The 'fhc apps update' command is deprecated. Please use 'fhc update' command instead.");
  }else if (action === 'delete'){
    return cb("The 'fhc apps delete' command is deprecated. Please use 'fhc delete' command instead.");
  } else if (action === 'ping'){
    return cb("The 'fhc apps ping' command is deprecated. Please use 'fhc ping' command instead.");
  } else{
    return cb(apps.usage);
  }
}

// list apps - works with old and ngui
function list(projectId, cb) {
  if (!cb) {
    cb = projectId;
    projectId = null;
  }

  ngui([], function(err, isNGUI) {
    if (err) return cb(err);

    common.listApps(projectId, function(err, data){
      if(err) return cb(err);

      if(ini.get('table') === true && data.list) {

        if (isNGUI) {
          var headers = ['Id', 'Title', 'Description', 'Type', 'Git', 'Branch'];
          var fields = ['guid', 'title', 'description', 'type', 'scmUrl', 'scmBranch'];
          apps.table = common.createTableFromArray(headers, fields, data.list);

        }else {
          apps.table = common.createTableForApps(data.list);
        }
      }

      if ('' !== ini.get('bare')) {
        var filter = 'id';
        if(ini.get('bare') !== true) filter = ini.get('bare');
        apps.bare = '';
        for (var a in data.list) {
          var app = data.list[a];
          if (apps.bare !== '') apps.bare = apps.bare + '\n';
          apps.bare = apps.bare + app[filter];
        }
      }
      return cb(err, data);
    });
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
  ngui([], function(err, isNGUI) {
    if (err) return cb(null, []);
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
  });
};