module.exports = migrate;

migrate.usage = "\nfhc migrate <appid>"
              + "\nfhc migrate <appid> --silent";

var fhc = require('./fhc');
var fhreq = require('./utils/request');
var common = require('./common');
var async = require('async');
var _ = require('underscore');
var readline = require('readline');
var ini = require('./utils/ini');
var log = require("./utils/log");

function migrate(args, cb) {
  if (args.length === 0){
    return cb(migrate.usage);
  }

  var appId = fhc.appId(args[0]);
  var projectId = null;
  var silent = false;

  // if using from lib, look for silent arg,
  // if cli, --silent not in args, so pull from argv if available
  if (args[args.length - 1] === 'silent') {
    silent = true;
  } else if (process.argv && process.argv.length && process.argv[process.argv.length - 1] === '--silent') {
    silent = true;
  }

  common.readApp(projectId, appId, function(err, app){
    if (err) return cb(err);

    if (app.app.migrated) return cb("App is already migrated");

    doMigrationCheck(app.app.guid, silent, cb);
  });
}

function doMigrationCheck(projectId, silent, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/migratecheck", "Error reading Project: ", function(err, data) {
    processCacheKeyRes(err, data, function(err, results) {
      if (err) return cb(err);

      continueMigration(projectId, silent, cb);
    });
  });
}

function continueMigration(projectId, silent, cb) {
  if (silent) {
    return doMigrate(projectId, cb);
  } else {
    // prompt for confirmation
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Continue with App migration?(y/N)', function(answer) {
      if ('y' === answer.toLowerCase()) {
        return doMigrate(projectId, cb);
      } else {
        return cb("Migration aborted");
      }
    });
  }
}

function doMigrate(projectId, cb) {
  fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/projects/" + projectId + "/migrate", {}, function (err, data, raw, response) {
    processCacheKeyRes(err, data, function(err, results) {
      if (err) return cb(err);

      return cb(err, "Migration complete");
    });
  });
}

function processCacheKeyRes(err, data, cb) {
  if (err) return cb(err);

  common.waitForJobWithUpdate(data.result, 0, printLogs, function(err, results) {
    if (err) {
      if (err[0] && err[0].log) {
        printLogs(err[0].log);
        return cb("Unable to migrate this App");
      }
      return cb(err);
    }

    if (!results || !results[0]) return cb("Unable to read migration log");

    if(results[0].status !== 'complete') {
      return cb("Unable to migrate this App");
    }

    return cb(null, results);
  });
}

function printLogs(logs) {
  _.each(logs, function(log){
    for(var key in log) {
      process.stdout.write('[' + key + '] ' + log[key] + '\n');
    }
  });
}