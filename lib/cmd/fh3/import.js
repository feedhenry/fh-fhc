/* globals i18n */
var fs = require('fs');
var common = require("../../common");
var fhreq = require("../../utils/request");

module.exports = {
  'desc' : i18n._('Import applications for into RHMAP projects'),
  'examples' :
  [{
    cmd : 'fhc import --project=<project> --title=<title> --template=<template> --zipFile=<zipFile> --env=<environment>',
    desc : i18n._('Import a previously exported RHMAP <zipFile> and create a new application with <title> and <template> into <project> deployed into <environment>')
  },
  {
    cmd : 'fhc import --project=<project-id> --title=<title> --template=<template> --gitRepo=<gitRepo> --gitBranch=<gitBranch> --env=<environment>',
    desc : i18n._('Import <gitRepo> into <gitBranch> and create a new application with <title> into <project> deployed into <environment>')
  }],
  'demand' : ['project', 'title','template'],
  'alias' : {
    'project':'p',
    'title':'t',
    'template':'tp',
    'zipFile':'zf',
    'gitRepo':'gr',
    'gitBranch':'gb',
    'env':'e',
    'json':'j',
    0 : 'project',
    1 : 'title',
    2 : 'template'
  },
  'describe' : {
    'project' : i18n._("Unique 24 character GUID of the project."),
    'title' : i18n._("Title of the application which will be created into this project"),
    'template' : i18n._("Template Type ID which will used as definition for the new create application via the import. See 'fhc templates' for further information"),
    'zipFile' : i18n._("Path of the zip-file exported from RHMAP"),
    'gitRepo' : i18n._("Link of the git repository of the application which will be imported. (E.g git@git.us.feedhenry.com:support/MyApp-Cordova-App.git)"),
    'gitBranch' : i18n._("The default value is master. Git branch which should be used in this import"),
    'env' : i18n._("Unique 24 character GUID of the environment where this application will be deployed after the import."),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(argv, cb) {
    if (!argv.zipFile && !argv.gitRepo) {
      return importBareRepo(argv, cb);
    }
    if (argv.gitRepo) {
      return importGitRepo(argv, cb);
    } else {
      return importZipFile(argv, cb);
    }
  }
};

/**
 * Import with bare git repo
 * @param params
 * @param cb
 */
function importBareRepo(params, cb) {
  var payload = {
    title: params.title,
    connections:[],
    template: {
      initaliseRepo: false,
      type: params.template
    }
  };

  var url = 'box/api/projects/' + params.project + '/apps';
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error importing git repo: "), function(err,data) {
    if (err) {
      return cb(err);
    }
    if (!params.json) {
      return cb(null, i18n._('Import completed successfully'));
    }
    return cb(null, data);
  });
}

/**
 * Import via the zip file exported from RHMAP studio
 * @param params
 * @param cb
 * @returns {*}
 */
function importZipFile(params, cb) {
  var file = params.zipFile;
  if (!fs.existsSync(file)) {
    return cb(i18n._("File doesn't exist: ") + file);
  }
  var url = fhreq.getFeedHenryUrl() + 'box/api/projects/' + params.project + '/apps';
  var formData = {
    title: params.title,
    templateType: params.template,
    templateZipFile: fs.createReadStream(file)
  };
  if (params.env) {
    formData.autoDeployOption = params.env;
  }
  return fhreq.uploadFile(url, file, formData, null, cb);
}

/**
 * Import via git repo informed
 * @param params
 * @param cb
 */
function importGitRepo(params, cb) {
  params.repoBranch = params.repoBranch || 'master';
  var payload = {
    title: params.title,
    connections:[],
    template: {
      repoUrl: params.gitRepo,
      type: params.template,
      imported: true,
      repoBranch: 'refs/heads/' + params.repoBranch
    }
  };

  var url = 'box/api/projects/' + params.project + '/apps';
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error importing git repo: "), function(err, data) {
    if (err) {
      return cb(err);
    }

    if (!params.json) {
      return cb(null, i18n._('Import via git repo completed successfully'));
    }
    return cb(null, data);
  });
}
