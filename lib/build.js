
module.exports = build;

build.usage = "\nfhc build <make-parameters>"
  + "\nfhc build make <make-parameters>"
  + "\nfhc build start <make-parameters>"
  + "\nfhc build status <status-parameters>"
  + "\n"
  + "\nwhere: <make-parameters> means: app=<appId> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false> provisioning=<path-to-provisioning-profile>"
  + "\nwhere: <status-parameters> means: cacheKey=<cache-key> start=<start>"
  + "\n"
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
var validateArgs = {};
var commands = {};

// main build entry point
function build (args, cb) {
  try {
    var argObj = parseArgs(args);
    validateArgs[argObj.command](argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + build.usage);
  }
  argObj.callback = cb; //function(data){ cb(null, data); };
  log(Object.keys(argObj));
  commands[argObj.command](argObj);
};

// expects all args to be in
function parseArgs(args) {
  var opts = new Object(),
      additionalArgsStart;

  if (Object.keys(commands).indexOf(args[0]) >= 0) {
    opts.command = args[0];
    additionalArgsStart = 1;
  } else {
    opts.command = 'make';
    additionalArgsStart = 0;
  }

  for(var i = additionalArgsStart ; i < args.length ; i++) {
    var arg = args[i],
        kv = arg.split("=", 2);
    if (kv.length < 2) throw new Error('Invalid argument format: ' + arg);
    log.silly(kv, 'build arg');
    opts[kv[0]] = (kv[1] == undefined ? "" : kv[1]);
  }

  return opts;
}

// runs through the args we got and validates as per our build rules
// TODO - may need to be more specific depending on build target type
validateArgs.make = function(args) {
  //looks for set alias
  if(args.app !== undefined ){/*look for alias*/
      args.app = fhc.appId(args.app);
  }
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
};
validateArgs.start = validateArgs.make;
validateArgs.status = function(args) {
};


commands.start = function(args) {
  startBuild(args, args.callback);
};
commands.status = function(args) {
  //TODO Consider making it standalone command.  Some "status" method may be useful in future.  On the other hand, some output should be context specific (here: build specific)
  //TODO Consider handling multiple cacheKeys
  common.isJobDone(args.cacheKey, args.start, function(err, response) {
    if (err) return args.callback(err);
    if (response.done) {
      //build.message = "Job " + args.cacheKey + " is done.";
      return doSomethingWithCompleteJob(args, [response.data]);
    } else if (response.progress) {
      build.message = "Job " + args.cacheKey + " is " + response.progress + "% done.";
    } else {
      build.message = "Job " + args.cacheKey + " is in progress.";
    }
    return args.callback(undefined, response.data);
  })
};
commands.make = function(args) {
  startBuild(args, function(err_cant_appear_here, keys) {
    async.map(keys, common.waitFor, function(err, results) {
      if (err) return args.callback(err);
      return doSomethingWithCompleteJob(args, results);
    });
  });
};

function doSomethingWithCompleteJob(args, results) {
  if (results[0] !== undefined) {
    var build_asset = results[0][0].action.url;
    if (build_asset) {
      build.message = "Download URL: " + build_asset;
      downloadBuild(args, build_asset, null, function() {
        return args.callback(undefined, results);
      });
    } else {
      build.message = "Download URL is not specified in this job.  Try the other cacheKey.";
      return args.callback(undefined, results);
    }
  }
}

function startBuild(args, cb) {
  var afterProvisioning = function() { requestBuildStart(args, cb); };
  if((this.destination === "iphone" || this.destination === "ipad") && this.provisioning){
    uploadProvisioning(args, afterProvisioning);
  } else {
    afterProvisioning();
  }
}

function uploadProvisioning(args, cb) {
  var resourceUrl = "/box/srv/1.1/dev/account/res/upload";
  var fields = {dest: args.destination, resourceType: 'provisioning', buildType: args.config, templateInstance: args.app};
  fhreq.uploadFile(resourceUrl, args.provisioning, fields, "application/octet-stream", function(err, data){
    if(data.result && data.result === "ok"){
      log.info("Provisioning profile uploaded");
      cb();
    } else {
      args.callback(err, "Failed to upload provisioning profile. Response is " + JSON.stringify(data));
    }
  });
}

function requestBuildStart(args, cb) {
  var uri = "box/srv/1.1/wid/" + fhc.domain + "/" + args.destination + "/" + args.app + "/deliver",
      payload = argsToPayload(args);
  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error reading app: ", function(err, data) {
    if(err) return args.callback(err);
    var keys = [];
    if(data.cacheKey) keys.push(data.cacheKey);
    if(data.stageKey) keys.push(data.stageKey);
    if (keys.length > 0) {
      build.message = "Build started. Watch for following keys: " + keys.join(', ');
      return cb(undefined, keys);
    } else {
      build.message = "Build started. No keys returned however, but following data: " + JSON.stringify(data || {});
      return cb(undefined, data);
    }
  });
}

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

// convert our args..
function argsToPayload(args) {
  var pl = "generateSrc=false";
  for (var i in args) {
    pl = pl + "&" + i + "=" + args[i];
  }
  return pl;
}

