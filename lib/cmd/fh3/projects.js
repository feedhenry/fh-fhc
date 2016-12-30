/* globals i18n */
module.exports = projects;

projects.desc = i18n._("Manage projects");
projects.usage = "fhc projects [list] [<author-email>]" +
    "\nfhc projects create <project-title> [<template-id>] --env=<environment>" +
    "\nfhc projects update <project-id> <prop-name> <value>" +
    "\nfhc projects read <project-id>" +
    "\nfhc projects delete <project-id>" +
    "\nfhc projects clone <project-id>" +
    i18n._("\nNote if --env is set when creating a project, the cloud app will be deployed to the specified environment automatically. Set it to 'none' if it should not be deployed to anywhere.") +
    i18n._("\nNote 'clone' does a 'git clone' of each each App in your Project into the current working directory.");

var common = require("../../common");
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require('../../utils/ini');
var _ = require('underscore');
var templates = require('../common/templates.js');
var clone = require('../fh3/clone.js');
var async = require('async');

function unknown(message, cb) {
  return cb(message + "\n" + i18n._("Usage: \n") + projects.usage);
}

function projects(argv, cb) {
  var args = argv._;
  if (args.length === 0) return listProjects(args, cb);

  var action = args[0];
  if ("list" === action) {
    return listProjects(args, cb);
  } else if ("create" === action) {
    var deployEnvironment = ini.getEnvironment(argv, true);
    return createProject(args, deployEnvironment, cb);
  } else if ("update" === action) {
    return updateProject(args, cb);
  } else if ("delete" === action) {
    return deleteProject(args, cb);
  } else if ("read" === action) {
    if (args.length !== 2) return cb(projects.usage);
    return readProject(args[1], cb);
  } else if ("clone" === action) {
    if (args.length !== 2) return cb(projects.usage);
    return cloneProject(args[1], cb);
  }else {
    return unknown(i18n._("Invalid action: ") + action, cb);
  }
}

function listProjects(args, cb) {
  common.listProjects(function (err, projs) {
    if (err) return cb(err);
    //Allow filtering by author email
    if(args[1]){
      projs = _.where(projs, {authorEmail: args[1]});
    }
    if (ini.get('table') === true) {
      projects.table = common.createTableForProjects(projs);
    }

    if(ini.get('bare') !== false) {
      var props = ['guid'];
      if (typeof ini.get('bare') === 'string') {
        props = ini.get('bare').split(" ");
      }
      projects.bare = '';
      _.each(projs, function(proj) {
        if (projects.bare !== '') projects.bare = projects.bare + '\n';
        for (var i=0; i<props.length; i++) {
          projects.bare = projects.bare + proj[props[i]] + " ";
        }
      });
    }

    return cb(err, projs);
  });
}

function createProject(args, deployEnvironment, cb) {
  if (args.length < 2) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var title = args[1];
  var templateId = args[2] || "bare_project";
  var payload =  {
    title: title,
    apps:[],
    services:[]
  };

  function doCall(template, cb) {
    payload.template = template;
    if(deployEnvironment){
      templates.setDeployEnvironment(payload, deployEnvironment);
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/api/projects", payload, i18n._("Error creating project: "), cb);
  }

  function pollCallback(err, project) {
    async.each(project.apps, function(app, acb) {
      if (app.scmCacheKey) return common.waitFor(app.scmCacheKey, acb);

      return acb();
    }, function(err) {
      if (err) return cb(err);

      // fresh read to ensure app models are fully populated
      return readProject(project.guid, cb);
    });
  }


  // Hackity hack: fh-art requires a custom blank template (which has no apps)
  // to facilitate this we have a sneaky 3'rd param here where we pass the template object in directly
  // This would be much cleaner if there was an API for creating Project Templates
  if (args[3] && (typeof args[3] === 'object')) {
    doCall(args[3], pollCallback);
  } else {
    templates({ _ : ['projects', templateId] }, function(err, template) {
      if (err) return cb(err);
      if (!template) return cb(i18n._('Template not found: ') + templateId);
      doCall(template, pollCallback);
    });
  }
}

function updateProject(args, cb) {
  if (args.length < 4) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var projectId = args[1];
  var propName = args[2];
  var value = args[3];

  readProject(projectId, function(err, project) {
    if (err) return cb(err);
    project[propName] = value;
    fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, project, function (err, remoteData, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(raw);
      return cb(null, remoteData);
    });
  });
}

function readProject(projectId, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId, i18n._("Error reading Project: "), cb);
}

function deleteProject(args, cb) {
  if (args.length < 2) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var endpoint = "box/api/projects/" + fhc.appId(args[1]);
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  i18n._("Error deleting project: "), function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function cloneProject(projectId, cb) {
  common.listApps(projectId, function(err, apps) {
    if (err) return cb(err);
    function doClone(app, cb1) {
      clone({ _ : [projectId, app.guid] }, cb1);
    }
    async.mapSeries(apps.list, doClone, function(err, results) {
      if (err) return cb(err);
      projects.message = '';
      _.each(results, function(result) {
        projects.message += result.stdout + '\n' + result.stderr;
      });
      return cb(null, results);
    });
  });
}

// bash completion
projects.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "projects") argv.unshift("projects");
  if (argv.length === 2) {
    return cb(null, ["clone", "create", "update", "read", "delete", "list"]);
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "read":
      case "clone":
      case "update":
      case "delete":
        common.getProjectIds(cb);
        break;
      default:
        return cb(null, []);
    }
  }
};
