/* globals i18n */
module.exports = restart;

restart.usage = "fhc app restart <app-id> --env=<environment>";
restart.desc = i18n._("Restart a cloud app");

var fhc = require("../../../fhc");
var common = require("../../../common");
var ini = require('../../../utils/ini');
var start = require('./start');
var stop = require('./stop');

// Main restart entry point
function restart(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(restart.usage);
  }

  var appId = fhc.appId(args[0]);
  var deployTarget = ini.getEnvironment(argv);
  return restartApp(appId, deployTarget, cb);
}

function restartApp(appId, deployTarget, cb) {
  stop({_: [appId, deployTarget]}, function (err) {
    if (err) {
      return cb(err);
    }
    start({_: [appId, deployTarget]}, function (err, resp) {
      if (err) {
        cb(err);
      }
      cb(null, resp);
    });
  });
}

// bash completion
restart.completion = function (opts, cb) {
  common.getAppIds(cb);
};
