"use strict";
module.exports = imports;

imports.usage = "\nfhc import <feedhenry zip file>";
imports.usage_ngui = "\nfhc import <project-id> <app-title> <app-template-type> [<zip-file> || <git-repo>]"
                   + "\nNote: if no file or repo is specified, a bare git repo is created";

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
var _ = require('underscore');
var ngui = require('../../ngui.js'); // TODO Remove this, can now be cfg.get('fhversion')
var request = require('request');
var os = require("os");
var templates = require('./templates.js');

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

// main import entry point
function imports (args, cb) {
  ngui([], function(err, isNGUI) {
    if (err) return cb(err);

    if (isNGUI) {
      if (args.length < 3) return cb(imports.usage_ngui);
      var projectId = args[0];
      var appTitle = args[1];
      var appTemplateType = args[2];
      var fileOrRepo = args[3];  // note this is optional, can be null
      return importAppNgui(projectId, appTitle, appTemplateType, fileOrRepo, cb);
    }else{
      if (args.length !== 1) return cb(imports.usage);
      var file = args[0];
      return importApp(file, cb);
    }
  });
}

function importApp(file, cb) {
  if (!fs.existsSync(file)) {
    return cb("File doesn't exist: " + file);
  }

  log.silly(file, "app import");
  var url = '/box/srv/1.1/ide/' + fhc.target +'/app/import?location=appanat.zip';

  fhreq.uploadFile(url, file, {type:'feedhenry', location: file}, 'application/zip', function(err, data){
    if(data.status === 'pending') {
      return common.waitForJob(data.cacheKey, 0, function(err, data){
        if(err) return cb(err);
        if(data[0].action && data[0].action.guid){
          imports.message = "Import complete: GUID: " + data[0].action.guid;
        }
        return cb(undefined, data);
      });
    }else {
      return cb(undefined, data);
    }
  });
}

function importAppNgui(projectId, appTitle, appTemplateType, fileOrRepo, cb) {

  if (!fileOrRepo) return importBareRepo();

  // simple test for a git repo - it's a git repo if it ends with '.git'!
  // TODO - probably cases where this breaks, discuss...
  var isRepo = common.endsWith(fileOrRepo, '.git');

  if (isRepo) return importGitRepo();
  else return importZipFile();

  // zip file import function
  function importZipFile() {
    var file = fileOrRepo;
    if (!fs.existsSync(file)) {
      return cb("File doesn't exist: " + file);
    }

    log.silly(file, "app import");
    var url = fhreq.getFeedHenryUrl() + 'box/api/projects/' + projectId + '/apps';

    var headers = {
      'Cookie' : "feedhenry=" + fhc.config.get("cookie") + ";",
	    'User-Agent' : "FHC/" + fhc.version + ' ' + os.platform() + '/' + os.release()
    };

    var r = request.post({url: url, headers:headers}, function(err, res, data) {
      if (err) return cb(err);
      if (res.statusCode !== 201) return cb('Error importing file: ' + res.body);
      return cb(undefined, data);
    });

    var form = r.form();
    form.append('title', appTitle);
    form.append('templateType', appTemplateType);
    form.append('templateZipFile', fs.createReadStream(file));
  };

  // Git import is a straight POST, no form related upload
  function importGitRepo() {
    var repo = fileOrRepo;
    var payload = {
      title: appTitle,
      connections:[],
      template: {
        repoUrl: repo,
        type: appTemplateType
      }
    };

    var url = 'box/api/projects/' + projectId + '/apps';
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  "Error importing git repo: ", cb);
  };

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
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  "Error importing git repo: ", cb);
  };

}

// bash completion
imports.completion = function (opts, cb) {
  ngui([], function(err, isNGUI) {
    if (err) return cb(null, []);
    if (!isNGUI) return common.getAppIds(cb);

    var argv = opts.conf.argv.remain;
    if (argv[1] !== "import") argv.unshift("import");
    if (argv.length === 2) {
      common.listProjects(function (err, projs) {
        if (err) return cb(null, []);
        return cb(null, _.pluck(projs, 'guid'));
      });
    }
  });
};
