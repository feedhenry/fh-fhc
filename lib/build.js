
module.exports = build;

build.usage = "\nfhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private key password> certpass=<certificate password>"
  + "\nwhere <destination> is one of: andriod, iphone, ipad, blackberry, windowsphone7"
  + "\nwhere <version> is specific to the destination, see supported destinations here: http://www.feedhenry.com/TODO"
  + "\nwhere <config> is either 'debug' (default), 'distribution', or 'release'"
  + "\n'keypass' and 'certpass' only needed for 'release' builds";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');

// main build entry point
function build (args, cb) {
  try{
    var argObj = parseArgs(args);
    validateArgs(argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + build.usage);
  }
  doBuild(argObj, cb);
};

// expects all args to be in 
function parseArgs(args) {
  var opts = new Object();
  for(var i=0; i<args.length; i++) {
    var arg = args[i];
    if(arg.indexOf('=') == -1) throw new Error('Invalid argument format: ' + arg);
    var kv = arg.split("=");
    log.silly(kv, 'build arg');
    opts[kv[0]] = (kv[1] == undefined ? "" : kv[1]);
  }
  return opts;
}

// runs through the args we got and validates as per our build rules
// TODO - may need to be more specific depending on build target type
function validateArgs(args) {
  if (args.app == undefined) throw new Error("Missing 'app' parameter");
  if (args.destination == undefined) throw new Error("Missing 'destination' parameter");
  if (args.version == undefined) throw new Error("Missing 'version' parameter");

  if (args.config == undefined) args.config = 'debug';
  
  if (args.config == 'release' || args.config == 'distribution') {
    if (args.keypass == undefined) throw new Error("Missing 'keypass' parameter");
    if (args.certpass == undefined) throw new Error("Missing 'certpass' parameter");
    args.privateKeyPass = args.keypass; // naff..
  }
  
  if(args.destination == "iphone" || args.destination == "ipad") {
    args.deviceType = args.destination;
  }
}

// convert our args..
function argsToPayload(args) {
  var pl = "generateSrc=false";
  for (var i in args) {
    pl = pl + "&" + i + "=" + args[i];
  }
  return pl;
}

// do the build..
function doBuild(args, cb) {
  var uri = "box/srv/1.1/wid/" + fhc.domain + "/" + args.destination + "/" + args.app + "/deliver";
  var payload = argsToPayload(args);
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error reading app: ", function(err, data) {
    if(err) return cb(err);
    var keys = [];
    if(data.cacheKey) keys.push(data.cacheKey);
    if(data.stageKey) keys.push(data.stageKey);
    if(keys.length > 0) {
      async.map(keys, common.waitFor, function(err, results) {
        return cb(err, results);
      });
    } else {
      return cb(err, data);
    }    
  });
};

