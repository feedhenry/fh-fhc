
module.exports = build;

build.usage = "\nfhc build app=<appId> destination=<destination> version=<version> config=<config> keypass=<private key password> certpass=<certificate password> download=<true|false> provisioning=<path to provisioning profile>"
  + "\nwhere <destination> is one of: andriod, iphone, ipad, blackberry, windowsphone7"
  + "\nwhere <version> is specific to the destination, see supported destinations here: http://www.feedhenry.com/TODO"
  + "\nwhere <config> is either 'debug' (default), 'distribution', or 'release'"
  + "\nwhere <provisioning> is the path to the provisioning profile"
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
var url = require("url");
var path = require("path");
var fs = require("fs");
var events = require("events");

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
  var doCall = function(){
    var payload = argsToPayload(args);
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error reading app: ", function(err, data) {
      if(err) return cb(err);
      var keys = [];
      if(data.cacheKey) keys.push(data.cacheKey);
      if(data.stageKey) keys.push(data.stageKey);
      if(keys.length > 0) {
        async.map(keys, common.waitFor, function(err, results) {
          if (results[0] !== undefined) {
            var build_asset = results[0][0].action.url;
            downloadBuild(args, build_asset, null, function() {
              return cb(err, results);
            });
          }
        });
      } else {
        return cb(err, data);
      }    
    });
  }
  
  if((args.destination === "iphone" || args.destination === "ipad") && args.provisioning){
    var resourceUrl = "/box/srv/1.1/dev/account/res/upload";
    var fields = {dest: args.destination, resourceType: 'provisioning', buildType: args.config, templateInstance: args.app};
    fhreq.uploadFile(resourceUrl, args.provisioning, fields, "application/octet-stream", function(err, data){
      if(data.result && data.result === "ok"){
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

function downloadBuild(args, asset_url, path, callback) {
  if (args.download !== 'true') { return callback(); }

  var host = url.parse(asset_url).hostname;
  var filename = url.parse(asset_url).pathname.split("/").pop();

  var theurl = http.createClient(80, host);
  var requestUrl = asset_url;
  log.info("Downloading file: " + filename);
  log.info("Before download request");
  var request = theurl.request('GET', requestUrl, {"host": host});
  request.end();

  var bar = null;
  var dlprogress = 0;

  setInterval(function () {
    log.info("Download progress: " + dlprogress + " bytes");
  }, 1000);

  request.addListener('response', function (response) {
    var downloadfile = fs.createWriteStream(filename, {'flags': 'a'});
    var filesize = parseInt(response.headers['content-length']);

    log.info("File size " + filename + ": " + filesize + " bytes.");

    response.addListener('data', function (chunk) {
      dlprogress += chunk.length;
      downloadfile.write(chunk, encoding='binary');
    });

    response.addListener("end", function() {
      downloadfile.end();
      log.info("Finished downloading " + filename);
      return callback();
    });
  });
}
