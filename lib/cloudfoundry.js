
module.exports = cloudfoundry;
cloudfoundry.usage = "\nfhc cloudfoundry target <app id> <cf target> <cf user> <cf pwd>";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var millicore = require("./utils/millicore.js");
var util = require('util');
var vmcjs = require('vmcjs');
var common = require('./common.js');
var async = require('async');
var apps = require('./apps.js');

// main CloudFoundry entry point..
function cloudfoundry (args, cb) {
  var action = args.shift();
  switch (action) {          
    case "target":  {
      if (args.length != 4) return unknown("target", cb);
      else return target(args[0], args[1], args[2], args[3], cb);
    };
    default: return unknown(action, cb);
  }
};

function unknown (action, cb) {  
  var msg = action ? "Wrong arguments for or unknown action: " + action + "\n" : "";
  msg += "Usage:\n" + cloudfoundry.usage;
  cb(msg);
};

// set target info..
function target(appId, cftarget, cfuser, cfpwd, cb) {
  log.verbose(appId, "cloudfoundry: appId");
  log.verbose(cftarget, "cloudfoundry: cftarget");
  log.verbose(cfuser, "cloudfoundry: cfuser");
  log.verbose(cfpwd, "cloudfoundry: cfpwd");

  // first validate CF target/login
  var vmc = new vmcjs.VMC(cftarget, cfuser, cfpwd);
  vmc.login(function(err, data) {
    if(err) return cb(err);
  
    // 'encrypt' CF pwd before setting..
    var buf = new Buffer(cfpwd, 'ascii');
    var encPwd = buf.toString('base64');
    log.silly(encPwd, "cloudfoundry: encPwd");
    
    // finally set the relevant app props..
    async.series([
      function(callback) { apps(['update', appId, 'nodejs.releasetarget', 'cloudfoundry'], callback);},
      function(callback) { apps(['update', appId, 'nodejs.cfurl', cftarget], callback);},
      function(callback) { apps(['update', appId, 'nodejs.cfuser', cfuser], callback);},
      function(callback) { apps(['update', appId, 'nodejs.cfpwd', encPwd], callback);}
    ], function(err, data){
      log.silly(data, "cloudfoundry: updated");    
      if(err) return cb(err);
      cloudfoundry.message = "CloudFoundry details set ok for App: " + appId;
      return cb(undefined, data);   
    });
  });
};

// bash completion
cloudfoundry.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "cloudfoundry") argv.unshift("cloudfoundry");
  if (argv.length === 2) {
    var cmds = ["target"];
    return cb(null, cmds);
  }
};