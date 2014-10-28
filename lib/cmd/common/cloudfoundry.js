
module.exports = cloudfoundry;
cloudfoundry.usage = "\nfhc cloudfoundry target <app-id> <cf-target> <cf-user> <cf-pwd>";
cloudfoundry.desc = "Stages an application to CloudFoundry";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var millicore = require("../../utils/millicore.js");
var util = require('util');
var vmcjs = require('vmcjs');
var common = require('../../common.js');
var async = require('async');

// main CloudFoundry entry point..
function cloudfoundry (argv, cb) {
  var args = argv._;
  return cb("fhc cloudfoundry command has been deprecated. Please use fhc deploy-target command instead.");
}

function unknown (action, cb) {
  var msg = action ? "Wrong arguments for or unknown action: " + action + "\n" : "";
  msg += "Usage:\n" + cloudfoundry.usage;
  cb(msg);
}

// set target info..
function target(appId, cftarget, cfuser, cfpwd, cb) {
  log.silly(appId, "cloudfoundry: appId");
  log.silly(cftarget, "cloudfoundry: cftarget");
  log.silly(cfuser, "cloudfoundry: cfuser");
  log.silly(cfpwd, "cloudfoundry: cfpwd");


  // first validate CF target/login
//  var vmc = new vmcjs.VMC(cftarget, cfuser, cfpwd);
//  vmc.login(function(err, data) {
//    if(err) return cb(err);

    var config = {
      livetarget: 'cloudfoundry',
      cfurl: cftarget,
      cfuser: cfuser,
      cfpwd: cfpwd
    };

    var params = {
      guid: appId,
      config: config
    };

    // call the 'setstagingconfig' endpoint
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/setstagingconfig", params, "Error setting staging configuration: ", function(err, data) {
      if(err) return cb(err);
      log.silly(data, "setstagingconfig");
      return cb(undefined, data);
    });
//  });
}

// bash completion
cloudfoundry.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "cloudfoundry") argv.unshift("cloudfoundry");
  if (argv.length === 2) {
    var cmds = ["target"];
    return cb(undefined, cmds);
  }
};
