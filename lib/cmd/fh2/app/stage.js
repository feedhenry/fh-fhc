/* globals i18n */
module.exports = stage;

stage.desc = i18n._("Stage a cloud app");
stage.usage = "\nfhc app stage <appId>"
            + "\nfhc app stage <appId> runtime=<node06|node08|node010>"
            + "\nfhc app stage <appId> [approver] [comment] runtime=<node06|node08|node010>> --env=<environment> "
            +"\nfhc app stage <appId> [number_of_instances] [approver] [comment] runtime=<node06|node08|node010> --env=<environment>"
            + i18n._("\nApprover is required if stage to Live environment. If it's not provided from the command line, user will be prompted for it.")
            + i18n._("\nComment is optional and should only be provided if Approver is set.");

var log = require("../../../utils/log");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var async = require('async');
var ini = require('../../../utils/ini');
var update = require('../../common/app/update.js');
var prompt = require('../../../utils/prompt');

// main stage entry point
function stage (argv, cb) {
  var args = argv._;
  if(args.length > 6 || args.length === 0) {
    return unknown("stage", cb);
  }

  var clean = ini.get('clean');
  var registry = ini.get('registry');
  var target = ini.getEnvironment(args, 'development');
  var runtime;
  var numappinstances;
  var approver;
  var comment;

  // horrible hack for passing flags as args if used from api, e.g. 'live' instead of ' - - live'
  function processArg(arg) {

    if(Number(arg)) {
      numappinstances = Number(arg);
    } else if(arg === 'live' || arg === 'development'){
      target = arg;
    } else if(arg === 'clean'){
      clean = true;
    }else if (arg.indexOf("runtime") === 0){
      var bits = arg.split("=");
      if(bits.length !== 2 || bits[1] === '') {
        return cb(i18n._("runtime needs to be set as runtime=node08"));
      }

      runtime= bits[1].trim();
    }
    else {
      //then arg should be either approver or comment,
      //but does rely on comment is after approver in command line
      if(approver){
        comment = arg;
      } else {
        approver = arg;
      }
    }
  }
  for(var i=1; i < args.length; i++){
    processArg(args[i]);
  }

  doStage(fhc.appId(args[0]), target, clean, numappinstances, approver, comment, runtime, registry, cb);
}

function unknown (action, cb) {
  cb(i18n._("Wrong arguments for or unknown action: ") + action + "\n" + i18n._("Usage:\n") + stage.usage);
}

function doStage(app, target, clean, numappinstances, approver, comment, runtime, registry, cb) {
  var type = 'stage';

  log.silly(target, 'Staging Target');
  if(target === 'live' || target === 'Live') {
    type = 'releasestage';
  }

  startStage(app, type, clean, numappinstances, approver, comment, runtime, registry, function(err){
    if(err){
      if(err.indexOf("approver") > -1){
        //the approver field is required, ask for it
        prompt(i18n._("Please enter approver:"), "", false, function(err, val){
          if(err) {
            return cb(err);
          }
          if(val && val.length > 0){
            approver = val;
            prompt(i18n._("Please enter comment:"), "", false, function(err, cval){
              if(err) {
                return cb(err);
              }
              cval = cval.replace(/[\r?\n]/g, "");
              if(cval.length > 0){
                comment = cval;
              }
              startStage(app, type, clean, numappinstances, approver, comment, runtime, registry, cb);
            });
          } else {
            return cb(i18n._("Approver name/email is required to stage to live environment."));
          }
        });
      } else {
        return cb(err);
      }
    } else {
      cb();
    }
  });
}

function startStage(app, type, clean, numappinstances, approver, comment, runtime, registry, cb){
  // constuct uri and payload
  var uri = "box/srv/1.1/ide/" + fhc.curTarget + "/app/" + type;
  var payload = { payload: { guid: app, clean: clean } };
  if (registry && registry !== '') {
    payload.payload.registry = registry;
  }
  if(numappinstances) {
    payload.payload.numappinstances = numappinstances;
  }
  if(type === "releasestage"){
    if(approver){
      payload.payload.approver = approver;
    }
    if(comment){
      payload.payload.comment = comment;
    }
  }
  if(runtime){
    log.silly("using node "  + runtime);
    payload.payload.runtime = runtime;
  }
  log.silly(payload, "Stage payload");

  // finally do our call
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error staging app: "), function(err, data) {
    if (err) {
      return cb(err);
    }
    async.map([data.cacheKey], common.waitFor, function(err, results) {
      if(err) {
        return cb(err);
      }
      if (results && results[0] && results[0][0] && results[0][0].status === 'complete') {
        stage.message = i18n._("App staged ok..");
      }

      // Set the 'instances' value if set
      if(numappinstances) {
        log.silly(numappinstances, "Setting nodejs.numappinstances");
        update.doUpdate(app, "nodejs.numappinstances", numappinstances, function(err, data){
          if(err) {
            return cb(err);
          }
          log.silly(data, "Response from update");
          return cb(undefined, results);
        });
      } else {
        return cb(undefined, results);
      }
    });
  });
}

// bash completion
stage.completion = function (opts, cb) {
  common.getAppIds(cb);
};
