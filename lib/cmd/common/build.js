/* globals i18n */
module.exports = build;

build.desc = i18n._("Builds a client application");
build.usage = "\nUsage:\n\tfhc build project=<project-id> app=<app-id> cloud_app=<cloud-app-id> tag=<tag> environment=<environment> destination=<destination> version=<version> config=<config> keypass=<private-key-password> certpass=<certificate-password> download=<true|false> bundleId=<credential bundle id> cordova_version=<cordova version>  git-tag=<tag name> git-branch=<branch name> git-commit=<commit hash>"
  + i18n._("\n\n")
  + i18n._("\n\t<environment id>      The id of a target environment, e.g. dev")
  + i18n._("\n\t<destination>         One of: android, iphone, ipad, ios(for universal binary), blackberry, windowsphone7, windowsphone (windows phone 8)")
  + i18n._("\n\t<version>             Specific to the destination (e.g. Android version 4.0)")
  + i18n._("\n\t<config>              Either 'debug' (default), 'distribution', or 'release'")
  + i18n._("\n\t<bundleId>            The unique bundle identifier of the credential bundle. You can get it using 'fhc credentials list'. Required for all iOS builds.")
  + i18n._("\n\t<cordova_version>     For specifying which version of Cordova to use. Currently supported: either 2.2 or 3.3. Only valid for Android for now.")
  + i18n._("\n\t<tag name>            The name of a connection tag for the cloud app, must be in Semantic Version format, e.g. 0.0.1.")
  + i18n._("\n\t<branch name>         The name of the git branch to build, defaults to 'master'")
  + i18n._("\n\t<commit hash>         The full hash of the commit to build, if not the head of the branch. Must be used with <branch name>")
  + i18n._("\n\t'keypass' only needed for 'release' builds");

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var async = require('async');
var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var _ = require("underscore");
var qrcode = require("qrcode-terminal");

function build(argv, cb) {
  var args = argv._;
  try {
    var argObj = common.parseArgs(args);
    validateArgs(argObj);
    validateArgsNgui(argObj);
    mutateGitRefArgs(argObj);
    doBuild(argObj, cb);
  } catch (x) {
    log.silly(x);
    return cb(i18n._("Error processing args: ") + x + "\n" + i18n._("Usage: ") + build.usage);
  }
}

function buildForIos(args) {
  return args.destination === "iphone" || args.destination === "ipad" || args.destination === "ios";
}


// runs through the args we got and validates as per our build rules
// TODO - may need to be more specific depending on build target type
function validateArgs(args) {
  if (!args.app) {
    throw new Error(i18n._("Missing 'app' parameter"));
  }
  if (!args.destination) {
    throw new Error(i18n._("Missing 'destination' parameter"));
  }

  if (!args.config) {
    args.config = 'debug';
  }

  if (args.config === 'release' || args.config === 'distribution') {
    if (!args.keypass) {
      throw new Error(i18n._("Missing 'keypass' parameter"));
    }

    if (!args.certpass) {
      throw new Error(i18n._("Missing 'certpass' parameter"));
    }
  }
  args.privateKeyPass = args.keypass; // naff..

  if (buildForIos(args)) {
    args.deviceType = args.destination;
  }

  // set default build version if none specified. Note this is hardcoded as not available from millicore API.
  // note these values were gotten from studio/static/js/application/destinations/destination_*
  if (!args.version) {
    if (args.destination === 'android') {
      args.version = '4.0';
    } else if (buildForIos(args)) {
      args.version = '6.0';
    }
  }
}

function validateArgsNgui(args) {
  if (!args.project) {
    throw new Error(i18n._("Missing 'project' parameter"));
  }
  if (!args.cloud_app) {
    throw new Error(i18n._("Missing 'cloud_app' parameter"));
  }
  if (buildForIos(args) && !args.bundleId) {
    throw new Error(i18n._("Missing 'bundleId' parameter"));
  }
  if (!args.environment) {
    throw new Error(i18n._("Missing 'environment' parameter"));
  }
}

// convert our args..
function argsToPayload(args) {
  args.generateSrc=false;
  return args;
}

/**
 * Mutates the arguments object in order to support --git-branch --git-commit and --git-tag, turning them into gitRef
 * @param  {Object} args Arguments object
 */
function mutateGitRefArgs(args) {
  // Workaround for current millicore behavior:
  // If no git- params are present, build from branch:master
  var gitParams = [
    'git-commit',
    'git-tag',
    'git-branch'
  ];
  if (!_.any(gitParams, _.propertyOf(args))) {
    args.gitRef = {
      type: 'branch',
      value: 'master'
    };
    return;
  }

  function clearGitParams(args) {
    _.each(gitParams, function(p) {
      delete args[p];
    });
  }

  // priority is commit > tag > branch
  if (args['git-commit']) {
    args.gitRef = {
      type: 'commit',
      value: args['git-commit'],
      hash: args['git-commit']
    };
    clearGitParams(args);
    return;
  }

  if (args['git-tag']) {
    args.gitRef = {
      type: 'tag',
      value: args['git-tag']
    };
    clearGitParams(args);
    return;
  }

  if (args['git-branch']) {
    args.gitRef = {
      type: 'branch',
      value: args['git-branch']
    };
    clearGitParams(args);
    return;
  }
}

function doBuild(args, cb) {
  var uri = "box/srv/1.1/wid/" + fhc.curTarget + "/" + args.destination + "/" + args.app + "/deliver";
  var doCall = function() {
    var payload = argsToPayload(args);
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error reading app: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      var keys = [];
      if (data.cacheKey) {
        keys.push(data.cacheKey);
      }
      //      if (data.stageKey) keys.push(data.stageKey);
      if (keys.length > 0) {
        async.map(keys, common.waitFor, function(err, results) {
          if (err) {
            return cb(err);
          }
          if (results[0] && results[0][0] && results[0][0].action) {
            var artifactUrls = results[0][0].action;
            getArtifactUrl(artifactUrls, function(err, buildResults) {
              if (err) {
                return cb(err);
              }
              var build_asset = buildResults.url;

              var doDownload = function() {
                downloadBuild(args, build_asset, './', function(err, data) {
                  if (err) {
                    return cb(err);
                  }
                  if (data) {
                    buildResults.download = data;
                    build.message = build.message + i18n._("\nDownloaded file: ") + data.file;
                  }
                  return cb(err, results);
                });
              };

              build.message = i18n._("\nDownload URL: ") + build_asset;
              if (buildResults.ota_url) {
                build.message = build.message + i18n._("\nOTA URL: ") + buildResults.ota_url;
                qrcode.generate(buildResults.ota_url, {small: true}, function(code) {
                  build.message = build.message + "\n" + code;
                  doDownload();
                });
              } else {
                doDownload();
              }
            });
          } else {
            return cb(err, results);
          }
        });
      } else {
        return cb(err, data);
      }
    });
  };

  doCall();
}

function getArtifactUrl(buildResults, cb) {
  if (buildResults.buildId) {
    //the self-managed build farm will return buildId. Call the artifacts endpoint to get the full url for downloading
    var buildId = buildResults.buildId;
    var uri = "box/srv/1.1/artifacts/" + buildId;
    fhreq.GET(fhreq.getFeedHenryUrl(), uri, function(err, data, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200 ) {
        return cb(raw);
      }
      buildResults.url = data.downloadurl;
      if (data.otaurl && data.otaurl.indexOf(".plist") >= 0) {
        //use the ios html file for ios OTA installation
        buildResults.ota_url = fhreq.getFeedHenryUrl() + "box/api/mas/storeitem/iosotahtml?url=" + data.otaurl;
      } else {
        buildResults.ota_url = data.otaurl;
      }
      return cb(null, buildResults);
    });
  } else {
    return cb(null, buildResults);
  }
}

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
    if (res.statusCode !== 200) {
      return cb(i18n._("Unexpected response code for file download: ") + res.statusCode + i18n._(" message: ") + res.body);
    }

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
      log.silly(i18n._('Finish stream event received'));
      finishOutoutStream();
    });

    stream.on('close', function() {
      log.silly(i18n._('close stream event received'));
      finishOutoutStream();
    });

    res.on('end', function() {
      log.silly(i18n._('End of netork stream received'));
      stream.end();
    });
  });

  req.on('error', function(err) {
    return cb(i18n._("Error downloading build: ") + err.message);
  });
}