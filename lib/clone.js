module.exports = clone;

clone.usage = "fhc clone <project-id> <app-id> [<local-dir>]";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var _ = require('underscore');
var templates = require('./templates.js');
var util = require('util');
var read = require('./read.js');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + clone.usage);
};

function clone(args, cb) {
  if (args.length < 2) return cb(clone.usage);
  doClone(args[0], args[1], args[2], cb);
};

function doClone(projectId, appId, localDir, cb) {
  read([projectId, appId], function(err, app) {
    if (err) return cb(err);
    if (app.gitApp === false) return cb('App does not have a git repo!');

    gitClone(app.scmUrl, app.scmBranch, localDir, function(err, data) {

      return cb(undefined, app);
    });
  });
};

function gitClone(url, branch, localDir, cb) {
  return cb('not implemented');
};

// bash completion
clone.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv.length === 2) {
    return common.getProjectIds(cb);
  }

  if (argv.length === 3) {
    var projectId = argv[2];
    common.listApps(projectId, function(err, apps){
      if(err) return cb(null, []);
      return cb(null, _.pluck(apps.list, 'guid'));
    });
  }
};
