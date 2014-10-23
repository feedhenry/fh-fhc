
module.exports = create;
create.create = create;

create.usage = "fhc create <app-title> [<git-repo> <git-branch>]";
create.usage_ngui = "fhc create <project-id> <app-title> [<template-id>]" +
                  "\nfhc create <project-id> <app-title> <template-type> <git-repo> [<git-branch>]";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("../../utils/exec.js");
var millicore = require("../../utils/millicore.js");
var ini = require('../../utils/ini');
var Table = require('cli-table');
var ngui = require('../../ngui.js'); // TODO Remove this, can now be cfg.get('fhversion')
var templates = require('./templates.js');
var _ = require('underscore');

// Main create entry point
function create (argv, cb) {
  var args = argv._;
  ngui([], function(err, isNGUI) {
    if (err) return cb(err);

    if (args.length === 0 || args.length > 5){
      return cb(isNGUI ? create.usage_ngui : create.usage);
    }

    if (isNGUI) {
      var project = args[0];
      var title = args[1];
      var template = args[2];
      var repo = args[3];
      var branch = args[4];

      if (repo) {
        return doCreateNguiFromRepo(project, title, template, repo, branch, cb);
      }else {
        return doCreateNguiFromTemplate(project, title, template || "hello_world_mbaas_instance" , cb);
      }
    } else {
      var title = args[0];
      var repo = args[1];
      var branch = args[2];
      return doCreate(title, repo, branch, cb);
    }
  });
}

// create app
function doCreate(appTitle, repo, branch, cb) {
  var nodejsEnabled = ini.get('nodejs') === true;
  var params =  {
      title: appTitle,
      height: 300,
      width: 200,
      description: appTitle,
      config: {'nodejs.enabled' : nodejsEnabled}
  };

  if (repo) {
    params.scmurl = repo;
  }

  if (branch) {
    params.scmbranch = branch;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/app/create", params, "Error creating new app: ", function(err, data) {
    if(err) return cb(err);
    log.silly(data, "app create");
    create.message = "\nApp created, id: " + data.guid + "\n";
    if (data.isScmApp && data.isScmPrivate) {
      create.message += "\nDetected a private repository.\n";
      create.message += "Please add the following public key to your repository's authorised keys.\n\n";
      create.message += data.publicKey + "\n\n";
      create.message += "Once added, you can trigger a pull using the following command:\n";
      create.message += "fhc git pull " + data.guid;
    }
    if(data.tasks && data.tasks[0]) {
      async.map([data.tasks[0]], common.waitFor, function(err, results) {
        if(err) return cb(err);
        // note we return the original 'data' here (not the output from the cache polling)
        return cb(err, data);
      });
    }else {
      // TODO: horrible hack, Millicore does not wait for git repos to be staged currently
      // (it returns immediatly), so for now (until issue 5248 is fixed) we wiat a few seconds here before returning)
      if(repo) {
        setTimeout(function(){ return cb(err, data);}, 3000);
      }else {
        return cb(err, data);
      }
    }
  });
}

function doCreateNguiFromTemplate(projectId, title, templateId, cb) {
  var payload = {
    "title": title,
    "connections":[]
  };

  templates(['apps', templateId], function(err, template) {
    if (err) return cb(err);
    if (!template) return cb('Template not found: ' + templateId);
    payload.template = template;

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps', payload, function (err, remoteData, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200 && response.statusCode !== 201) return cb(raw);
      return cb(null, remoteData);
    });
  });
}

function doCreateNguiFromRepo(projectId, title, templateType, repo, branch, cb) {
  var payload = {
    "title": title,
    "connections":[],
    "template": {
      "type": templateType,
      "repoUrl": repo,
      "repoBranch": branch || "refs/heads/master"
    }
  };

  fhreq.POST(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps', payload, function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (response.statusCode !== 200 && response.statusCode !== 201) return cb(raw);
    return cb(null, remoteData);
  });
}

// bash completion
create.completion = function (opts, cb) {
  ngui([], function(err, isNGUI) {
    if (err) return cb(null, []);
    if (!isNGUI) return common.getAppIds(cb);

    var argv = opts.conf.argv.remain;
    if (argv[1] !== "create") argv.unshift("create");
    if (argv.length === 2) {
      common.listProjects(function (err, projs) {
        if (err) return cb(null, []);
        return cb(null, _.pluck(projs, 'guid'));
      });
    }
  });
};
