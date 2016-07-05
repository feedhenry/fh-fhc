/* globals i18n */
module.exports = clone;

clone.usage = "fhc clone <project-id> <app-id> [<local-dir>]";
clone.desc = i18n._("Performs a git clone of a feedhenry application");

var log = require("../../utils/log");
var common = require("../../common");
var _ = require('underscore');
var read = require('../fh2/app/read.js');

function clone(argv, cb) {
  var args = argv._;
  if (args.length < 2) return cb(clone.usage);
  doClone(args[0], args[1], args[2], cb);
}

function doClone(projectId, appId, localDir, cb) {
  read({_: [projectId, appId]}, function (err, app) {
    if (err) return cb(err);
    if (app.gitApp === false) return cb(i18n._('App does not have a git repo!'));

    // note we don't use 'scmUrl' property here
    gitClone(app.internallyHostedRepoUrl, app.scmBranch, localDir, cb);
  });
}

function gitClone(url, branch, localDir, cb) {
  if (!branch) branch = 'master';
  var exec = require('child_process').exec;
  var cmd = 'git clone ' + url + ' -b ' + branch;
  if (localDir) cmd = cmd + ' ' + localDir;
  log.silly(cmd);
  exec(cmd, function (err, stdout, stderr) {
    if (err) return cb(err);
    return cb(undefined, {stdout: stdout, stderr: stderr});
  });
}

// bash completion
clone.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv.length === 2) {
    return common.getProjectIds(cb);
  }

  if (argv.length === 3) {
    var projectId = argv[2];
    common.listApps(projectId, function (err, apps) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(apps.list, 'guid'));
    });
  }
};
