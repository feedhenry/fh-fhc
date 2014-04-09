module.exports = build;

build.usage = "\nfhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false> provisioning=<path-to-provisioning-profile> cordova_version=<cordova version>" 
  + "\nwhere <destination> is one of: andriod, iphone, ipad, ios(for universal binary), blackberry, windowsphone7, windowsphone (windows phone 8)" 
  + "\nwhere <version> is specific to the destination (e.g. Android version 4.0)" 
  + "\nwhere <config> is either 'debug' (default), 'distribution', or 'release'" 
  + "\nwhere <provisioning> is the path to the provisioning profile"  
  + "\nwhere <cordova_version> is for specifying which version of Cordova to use. Currently supported: either 2.2 or 3.3. Only valid for Android for now." 
  + "\n'keypass' and 'certpass' only needed for 'release' builds" 
  + "\n'provisioning' is only optional for iphone or ipad builds";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var sys = require("util");
var http = require("http");
var https = require("https");
var url = require("url");
var path = require("path");
var fs = require("fs");
var events = require("events");

// main build entry point
function build(args, cb) {
  try {
    var argObj = common.parseArgs(args);
    validateArgs(argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + build.usage);
  }
  doBuild(argObj, cb);
};


// runs through the args we got and validates as per our build rules
// TODO - may need to be more specific depending on build target type
function validateArgs(args) {
  //looks for set alias
  if (args.app !== undefined) { /*look for alias*/
    args.app = fhc.appId(args.app);
  }
  if (args.app == undefined) throw new Error("Missing 'app' parameter");
  if (args.destination == undefined) throw new Error("Missing 'destination' parameter");

  if (args.config == undefined) args.config = 'debug';

  if (args.config == 'release' || args.config == 'distribution') {
    if (args.keypass == undefined) throw new Error("Missing 'keypass' parameter");
    if (args.certpass == undefined) throw new Error("Missing 'certpass' parameter");
    args.privateKeyPass = args.keypass; // naff..
  }

  if (args.destination == "iphone" || args.destination == "ipad" || args.destination == "ios") {
    args.deviceType = args.destination;
  }

  // set default build version if none specified. Note this is hardcoded as not available from millicore API.
  // note these values were gotten from studio/static/js/application/destinations/destination_*
  if (!args.version) {
    if (args.destination === 'android') {
      args.version = '4.0';
    } else if (args.destination === 'ios' || args.destination === 'iphone' || args.destination === 'ipad') {
      args.version = '6.0';
    }
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
  var uri = "box/srv/1.1/wid/" + fhc.target + "/" + args.destination + "/" + args.app + "/deliver";
  var doCall = function() {
    var payload = argsToPayload(args);
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error reading app: ", function(err, data) {
      if (err) return cb(err);
      var keys = [];
      if (data.cacheKey) keys.push(data.cacheKey);
      //      if(data.stageKey) keys.push(data.stageKey);
      if (keys.length > 0) {
        async.map(keys, common.waitFor, function(err, results) {
          if (err) return cb(err);
          if (results[0] !== undefined) {
            var build_asset = results[0][0].action.url;
            build.message = "\nDownload URL: " + build_asset;
            downloadBuild(args, build_asset, './', function(err, data) {
              if (err) return cb(err);
              if (data) {
                results.push({
                  download: data
                });
                build.message = build.message + "\nDownloaded file: " + data.file;
              }
              return cb(err, results);
            });
          }
        });
      } else {
        return cb(err, data);
      }
    });
  }

  if ((args.destination === "iphone" || args.destination === "ipad" || args.destination === "ios") && args.provisioning) {
    var resourceUrl = "/box/srv/1.1/dev/account/res/upload";
    var fields = {
      dest: args.destination,
      resourceType: 'provisioning',
      buildType: args.config,
      templateInstance: args.app
    };
    fhreq.uploadFile(resourceUrl, args.provisioning, fields, "application/octet-stream", function(err, data) {
      if (data.result && data.result === "ok") {
        log.info("Provisioning profile uploaded");
        doCall();
      } else {
        cb(err, "Failed to upload provisioning profile. Response is " + JSON.stringify(data));
      }
    })
  } else {
    doCall();
  }
};

function downloadBuild(args, assetUrl, path, cb) {
  if (args.download !== 'true') {
    return cb();
  }
  var uri = url.parse(assetUrl);
  var fileName = path + uri.pathname.split('/').pop();
  var proto = uri.protocol === 'https:' ? https : http;

  log.silly(uri, "download uri");
  log.silly(fileName, "download filename");
  log.silly(proto, "download protocol");

  var req = proto.get(uri, function(res) {
    var closedAlready = false;
    if (res.statusCode !== 200) return cb("Unexpected response code for file download: " + res.statusCode + " message: " + res.body);

    var stream = fs.createWriteStream(fileName);
    res.on('data', function(chunk) {
      stream.write(chunk);
    });


    function finishOutoutStream() {
      if (!closedAlready) {
        closedAlready = true;
        return cb(undefined, {
          url: assetUrl,
          file: fileName
        });
      }
    }

    stream.on('finish', function() {
      log.silly('Finish stream event received');
      finishOutoutStream();
    });

    stream.on('close', function() {
      log.silly('close stream event received');
      finishOutoutStream();
    });

    res.on('end', function() {
      log.silly('End of netork stream received');
      stream.end();
    });
  });

  req.on('error', function(err) {
    return cb("Error downloading build: " + err.message);
  });
};
