/* globals i18n */
module.exports = create;
create.create = create;

create.desc = i18n._("Creates a FeedHenry app");
create.usage = "fhc apps create <app-title> [<git-repo> <git-branch>]";
create.usage_ngui = "fhc apps create <project-id> <app-title> [<template-id>]  --env=environment" +
  "\nfhc apps create <project-id> <app-title> <template-type> <git-repo> [<git-branch>]  --env=environment" +
  i18n._("\nNote: If --env is provided and the app is deployed, it will be deployed to the specified environment automatically. Set it to 'none' if it should not be deployed to anywhere.");

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var async = require('async');
var ini = require('../../../utils/ini');
var templates = require('../../common/templates.js');
var _ = require('underscore');

// Main create entry point
function create(argv, cb) {
  var args = argv._,
    isNGUI = ini.get('fhversion') >= 3;

  if (args.length === 0 || args.length > 5) {
    return cb(isNGUI ? create.usage_ngui : create.usage);
  }

  var title, repo, branch;
  if (isNGUI) {
    var project = args[0];
    var template = args[2];
    title = args[1];
    repo = args[3];
    branch = args[4];
    var deployEnv = ini.getEnvironment(argv, true);
    if (repo) {
      return doCreateNguiFromRepo(project, title, template, repo, branch, deployEnv, cb);
    } else {
      return doCreateNguiFromTemplate(project, title, template || "hello_world_mbaas_instance", deployEnv, cb);
    }
  } else {
    title = args[0];
    repo = args[1];
    branch = args[2];
    return doCreate(title, repo, branch, cb);
  }
}

// create app
function doCreate(appTitle, repo, branch, cb) {
  var nodejsEnabled = ini.get('nodejs') === true;
  var params = {
    title: appTitle,
    height: 300,
    width: 200,
    description: appTitle,
    config: {'nodejs.enabled': nodejsEnabled}
  };

  if (repo) {
    params.scmurl = repo;
  }

  if (branch) {
    params.scmbranch = branch;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/create", params, i18n._("Error creating new app: "), function (err, data) {
    if (err) {
      return cb(err);
    }
    log.silly(data, "app create");
    create.message = i18n._("\nApp created, id: ") + data.guid + "\n";
    if (data.isScmApp && data.isScmPrivate) {
      create.message += i18n._("\nDetected a private repository.\n");
      create.message += i18n._("Please add the following public key to your repository's authorised keys.\n\n");
      create.message += data.publicKey + "\n\n";
      create.message += i18n._("Once added, you can trigger a pull using the following command:\n");
      create.message += "fhc git pull " + data.guid;
    }
    if (data.tasks && data.tasks[0]) {
      async.map([data.tasks[0]], common.waitFor, function (err) {
        if (err) {
          return cb(err);
        }
        // note we return the original 'data' here (not the output from the cache polling)
        return cb(err, data);
      });
    } else {
      // TODO: horrible hack, Millicore does not wait for git repos to be staged currently
      // (it returns immediatly), so for now (until issue 5248 is fixed) we wiat a few seconds here before returning)
      if (repo) {
        setTimeout(function () {
          return cb(err, data);
        }, 3000);
      } else {
        return cb(err, data);
      }
    }
  });
}

function doCreateNguiFromTemplate(projectId, title, templateId, deployEnv, cb) {
  var payload = {
    "title": title,
    "connections": []
  };

  templates({_: ['apps', templateId]}, function (err, template) {
    if (err) {
      return cb(err);
    }
    if (!template) {
      return cb(i18n._('Template not found: ') + templateId);
    }
    payload.template = template;
    if (deployEnv) {
      payload.template.autoDeployOnCreate = deployEnv;
    }

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps', payload, function (err, remoteData, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200 && response.statusCode !== 201) {
        return cb(raw);
      }
      return cb(null, remoteData);
    });
  });
}

function doCreateNguiFromRepo(projectId, title, templateType, repo, branch, deployEnv, cb) {
  var payload = {
    "title": title,
    "connections": [],
    "template": {
      "type": templateType,
      "repoUrl": repo,
      "repoBranch": branch || "refs/heads/master"
    }
  };

  if (deployEnv) {
    payload.template.autoDeployOnCreate = deployEnv;
  }
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + '/apps', payload, function (err, remoteData, raw, response) {
    if (err) {
      return cb(err);
    }
    if (response.statusCode !== 200 && response.statusCode !== 201) return cb(raw);
    return cb(null, remoteData);
  });
}

// bash completion
create.completion = function (opts, cb) {
  var isNGUI = ini.get('fhversion') >= 3;
  if (!isNGUI) {
    return common.getAppIds(cb);
  }

  var argv = opts.conf.argv.remain;
  if (argv[1] !== "create") argv.unshift("create");
  if (argv.length === 2) {
    common.listProjects(function (err, projs) {
      if (err) {
        return cb(null, []);
      }
      return cb(null, _.pluck(projs, 'guid'));
    });
  }
};
