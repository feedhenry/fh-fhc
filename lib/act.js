
module.exports = act;

act.usage = "\nfhc act <app id> <server function> <params>";
             
var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var millicore = require("./utils/millicore.js");
var common = require("./common.js");
var util = require('util');

// main act entry point
function act (args, cb) {
  if (args.length < 2) return cb(act.usage);
 
  var appId = args[0];
  var funct = args[1];
  var data = {};

  if (args[2]) data = JSON.parse(args[2]);
  log.silly(data, "params");
  millicore.widgForAppId(appId, function (err, widgId) {
    if(err) return cb(err);
    log.silly(widgId, "widgId");
    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/act/" + fhc.domain + "/" + widgId + "/" + funct + "/" + appId, data, function (err, remoteData, raw, response) {
      if (err) {
        log.verbose("Error in act: " + err);
        log.verbose(remoteData, "list");
        return cb(err);
      }
      return cb(err, remoteData);        
    });
  });
};

// bash completion
act.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  
  // only complete for 3'rd param, i.e. 'fhc act <tab>'
  if (argv.length === 2) {  
    common.getAppIds(cb); 
  }
};