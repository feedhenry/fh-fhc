module.exports = artifacts;

artifacts.usage = "fhc artifacts <project-id> <app-id>";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var _ = require('underscore');
var templates = require('./templates.js');
var util = require('util');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + artifacts.usage);
}

function artifacts(args, cb) {
  if (args.length < 2) return cb(artifacts.usage);
  doArtifacts(args[0], args[1], cb);
}

function doArtifacts(projectId, appId, cb) {
  var url = 'box/srv/1.1/artifacts?isBuild=true&appId=' + appId;
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Artifacts: ", function(err, arts){
    if (err) return cb(err);

    if (ini.get('table') === true) {
      var headers = ['Platform', 'App Version', 'Date', 'Type', 'Credential', 'Url'];
      var fields = ['destination', 'appVersion', 'sysModified', 'type', 'credential', 'otaurl'];
      artifacts.table = common.createTableFromArray(headers, fields, arts);
    }

    return cb(err, arts);
  });
}

// bash completion
artifacts.completion = function (opts, cb) {
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
