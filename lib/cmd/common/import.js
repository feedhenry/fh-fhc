/* globals i18n */
"use strict";
module.exports = imports;

imports.desc = i18n._("Import a previously exported FeedHenry zipfile");
imports.usage = "\nfhc import <project-id> <app-title> <app-template-type> [<zip-file> || <git-repo>] [<git-branch>] --env=environment"
  + i18n._("\nNote: If --env is provided and the app is deployed, it will be deployed to the specified environment automatically. Set it to 'none' if it should not be deployed to anywhere.")
  + i18n._("\nNote: if no file or repo is specified, a bare git repo is created");

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var ini = require("../../utils/ini");
var common = require("../../common");
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var os = require("os");

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

// main import entry point
function imports(argv, cb) {
  var args = argv._;
  if (args.length < 3) {
    return cb(imports.usage);
  }
  var projectId = args[0];
  var appTitle = args[1];
  var appTemplateType = args[2];
  var fileOrRepo = args[3];  // note this is optional, can be null
  // note this is optional, will default to master
  var repoBranch = args[4] || 'master';
  var deployEnv = ini.getEnvironment(argv, true);
  return importAppNgui(projectId, appTitle, appTemplateType, fileOrRepo, repoBranch, deployEnv, cb);
}


function importAppNgui(projectId, appTitle, appTemplateType, fileOrRepo, repoBranch, deployEnv, cb) {

  if (!fileOrRepo) {
    return importBareRepo();
  }

  // simple test for a git repo - it's a git repo if it ends with '.git'!
  // TODO - probably cases where this breaks, discuss...
  var isRepo = common.endsWith(fileOrRepo, '.git');

  if (isRepo) {
    return importGitRepo();
  } else {
    return importZipFile();
  }

  // zip file import function
  function importZipFile() {
    var file = fileOrRepo;
    if (!fs.existsSync(file)) {
      return cb(i18n._("File doesn't exist: ") + file);
    }

    log.silly(file, "app import");
    var url = fhreq.getFeedHenryUrl() + 'box/api/projects/' + projectId + '/apps';

    var headers = {
      'Cookie' : "feedhenry=" + fhc.config.get("cookie") + ";",
      'User-Agent' : "FHC/" + fhc._version + ' ' + os.platform() + '/' + os.release()
    };

    var formData = {
      title: appTitle,
      templateType: appTemplateType,
      templateZipFile: fs.createReadStream(file)
    };

    if (deployEnv) {
      formData.autoDeployOption = deployEnv;
    }

    request.post({url: url, headers:headers, proxy: fhc.config.get("proxy"), formData: formData}, function(err, res, data) {
      if (err) {
        return cb(err);
      }
      if (res.statusCode !== 201) {
        return cb(i18n._('Error importing file: ') + res.body);
      }
      return cb(undefined, data);
    });
  }

  // Git import is a straight POST, no form related upload
  function importGitRepo() {
    var repo = fileOrRepo;
    var payload = {
      title: appTitle,
      connections:[],
      template: {
        repoUrl: repo,
        type: appTemplateType,
        imported: true,
        repoBranch: 'refs/heads/' + repoBranch
      }
    };

    var url = 'box/api/projects/' + projectId + '/apps';
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error importing git repo: "), function(err, data) {
      if (err) {
        return cb(err);
      }

      log.silly('import response', data);
      return cb(null, data);
    });
  }

  // Import with bare git repo
  function importBareRepo() {
    var payload = {
      title: appTitle,
      connections:[],
      template: {
        initaliseRepo: false,
        type: appTemplateType
      }
    };

    var url = 'box/api/projects/' + projectId + '/apps';
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error importing git repo: "), cb);
  }
}

// bash completion
imports.completion = function(opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "import") {
    argv.unshift("import");
  }
  if (argv.length === 2) {
    common.listProjects(function(err, projs) {
      if (err) {
        return cb(null, []);
      }
      return cb(null, _.pluck(projs, 'guid'));
    });
  }
};
