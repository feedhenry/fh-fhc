/* globals i18n */
var log = require("../../utils/log");
var fhc = require("../../fhc");

module.exports = {
  'desc' : i18n._('Performs a git clone of an application'),
  'examples' : [{
    cmd : 'fhc clone --project=<project> --app=<app> --local=<local>',
    desc : i18n._('Performs a git clone of the <app> from the project <project> into the path <local>')}],
  'demand' : ['project', 'app'],
  'alias' : {
    'project':'p',
    'app':'a',
    'local':'a',
    0 : 'project',
    1 : 'app',
    2 : 'local'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'project' : i18n._("Unique 24 character GUID of your project"),
    'local' : i18n._("Path where you want the application be cloned")
  },
  'customCmd': function(argv, cb) {
    doClone(argv.project, argv.app, argv.local, cb);
  }
};

function doClone(projectId, appId, localDir, cb) {
  fhc.app.read({ project:projectId, app:appId}, function(err, app) {
    if (err) {
      return cb(err);
    }
    if (app.gitApp === false) {
      return cb(i18n._('App does not have a git repo!'));
    }

    // note we don't use 'scmUrl' property here
    gitClone(app.internallyHostedRepoUrl, app.scmBranch, localDir, cb);
  });
}

function gitClone(url, branch, localDir, cb) {
  if (!branch) {
    branch = 'master';
  }
  var exec = require('child_process').exec;
  var cmd = 'git clone ' + url + ' -b ' + branch;
  if (localDir) {
    cmd = cmd + ' ' + localDir;
  }
  log.silly(cmd);
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      return cb(err);
    }
    var message = stdout + stderr;
    return cb(undefined, message);
  });
}
