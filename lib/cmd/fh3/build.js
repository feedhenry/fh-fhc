/* globals i18n */
var fhreq = require("../../utils/request");
var common = require("../../common.js");
var log = require("../../utils/log");
var fhc = require("../../fhc");
var async = require('async');
var http = require("http");
var https = require("https");
var url = require("url");
var fs = require("fs");
var _ = require("underscore");
var qrcode = require("qrcode-terminal");

module.exports = {
  'desc' : i18n._('Builds a client application'),
  'examples' :
    [{
      cmd : 'fhc build --project=<project> --app=<app-id> --cloud_app=<cloud-app-id> --tag=<tag> --environment=<environment> --destination=<destination> --version=<version> --config=<release|distribution> --privateKeyPass=<private-key-password> --certpass=<certificate-password> --download=<true|false> --bundleId=<credential bundle id> --cordova_version=<cordova version>  --git-tag=<tag name> --git-branch=<branch name> --git-commit=<commit hash>',
      desc : "Build a client <app> of the <project> connect to the <cloud_app> deployed into the <environment>"
    }],
  'demand' : ['app','destination','environment'],
  'alias' : {
    'project': 'p',
    'app': 'a',
    'cloud_app': 'ca',
    'tag': 't',
    'environment': 'e',
    'destination': 'd',
    'version': 'v',
    'config': 'c',
    'privateKeyPass': 'pk',
    'certpass': 'cp',
    'download': 'dw',
    'bundleId': 'b',
    'cordova_version': 'cv',
    'git-tag': 'gt',
    'git-branch': 'gb',
    'git-commit': 'gc',
    'json' : 'j',
    0: 'app',
    1: 'destination',
    2: 'environment'
  },
  'describe' : {
    'project' : i18n._("Unique 24 character GUID of the project."),
    'app' : i18n._("Unique 24 character GUID of the client app which will be built."),
    'cloud_app' : i18n._("Unique 24 character GUID of the cloud app which the client app will connect to."),
    'tag' : i18n._("The name of a connection tag for the cloud app, must be in Semantic Version format, e.g. 0.0.1. See: http://semver.org."),
    'environment' : i18n._("The id of a target environment, e.g. dev."),
    'destination' : i18n._("One of: android, iphone, ipad, ios(for universal binary), blackberry, windowsphone7, windowsphone (windows phone 8)."),
    'version' : i18n._("Specific to the destination (e.g. Android version 4.0)."),
    'config' : i18n._("Either 'debug' (default), 'distribution', or 'release'."),
    'privateKeyPass' : i18n._("Private key password of the bundleId, only needed for 'release' builds."),
    'certpass' : i18n._("Certificate password."),
    'download' : i18n._("Boolean value to inform to download or not the built when it finish."),
    'bundleId' : i18n._("The unique bundle identifier of the credential bundle. You can get it using 'fhc credentials list'. Required for all iOS builds."),
    'cordova_version' : i18n._("For specifying which version of Cordova to use. Currently supported: either 2.2 or 3.3. Only valid for Android for now."),
    'git-tag' : i18n._("Long value of URL that you want shorter for the henr.ie URL."),
    'git-branch' : i18n._("The name of the git branch to build, defaults to 'master'."),
    'git-commit' : i18n._("The full hash of the commit to build, if not the head of the branch. Must be used with <branch name>."),
    'json' : i18n._('Output into json format')
  },
  'preCmd' : function(params,cb) {
    if (!params.config) {
      params.config = 'debug';
    } else if (params.config === 'release' || params.config === 'distribution') {
      if (!params.privateKeyPass) {
        return cb(i18n._("Missing 'privateKeyPass' parameter"));
      }
      if (!params.certpass) {
        return cb(i18n._("Missing 'certpass' parameter"));
      }
    }
    if (isIosBuild(params)) {
      params.deviceType = params.destination;
      if (!params.bundleId) {
        return cb(i18n._("Missing 'bundleId' parameter"));
      }
    }
    // set default build version if none specified. Note this is hardcoded as not available from millicore API.
    // note these values were gotten from studio/static/js/application/destinations/destination_*
    if (!params.version) {
      if (params.destination === 'android') {
        params.version = '4.0';
      } else if (isIosBuild(params)) {
        params.version = '6.0';
      }
    }
    return cb(null, params);
  },
  'customCmd' : function(params,cb) {
    try {
      mutateGitRefArgs(params);
      doBuild(params, cb);
    } catch (x) {
      log.silly(x);
      return cb(i18n._("Error processing params: ") + x + "\n");
    }
  }
};

/**
 * Check if the destination is iphone, ipad or ios
 * @param params
 * @returns {boolean}
 */
function isIosBuild(params) {
  return params.destination === "iphone" || params.destination === "ipad" || params.destination === "ios";
}

/**
 * Mutates the arguments object in order to support --git-branch --git-commit and --git-tag, turning them into gitRef
 * @param  {Object} params Arguments object
 */
function mutateGitRefArgs(params) {
  // Workaround for current millicore behavior:
  // If no git- params are present, build from branch:master
  var gitParams = [
    'git-commit',
    'git-tag',
    'git-branch'
  ];
  if (!_.any(gitParams, _.propertyOf(params))) {
    params.gitRef = {
      type: 'branch',
      value: 'master'
    };
    return;
  }

  function clearGitParams(params) {
    _.each(gitParams, function(p) {
      delete params[p];
    });
  }

  // priority is commit > tag > branch
  if (params['git-commit']) {
    params.gitRef = {
      type: 'commit',
      value: params['git-commit'],
      hash: params['git-commit']
    };
    clearGitParams(params);
    return;
  }

  if (params['git-tag']) {
    params.gitRef = {
      type: 'tag',
      value: params['git-tag']
    };
    clearGitParams(params);
    return;
  }

  if (params['git-branch']) {
    params.gitRef = {
      type: 'branch',
      value: params['git-branch']
    };
    clearGitParams(params);
    return;
  }
}

/**
 * To create the URL to perform the build
 * @param params
 * @returns {string}
 */
function createUri(params) {
  return "box/srv/1.1/wid/" + fhc.curTarget + "/" + params.destination + "/" + params.app + "/deliver";
}
function createMessageWithOtaUrl(message, buildResults) {
  message = message + i18n._("\nOTA URL: ") + buildResults.ota_url;
  qrcode.generate(buildResults.ota_url, {small: true}, function(code) {
    message = message + "\n" + code;
  });
  return message;
}

/**
 * Download the artefact built into the local directory
 * @param params
 * @param build_asset
 * @param cb
 * @param buildResults
 * @param message
 */
function doDownload(params, build_asset, cb, buildResults, message) {
  downloadBuild(params, build_asset, './', function(err, data) {
    if (err) {
      return cb(err);
    }
    if (data) {
      buildResults.download = data;
      message = message + i18n._("\nDownloaded file: ") + data.file;
    }
    return cb(null, message);
  });
}

/**
 * Create and print the console message
 * @param message
 * @param buildResults
 * @param params
 * @param cb
 */
function doConsoleMessage(message, buildResults, params, cb) {
  message = i18n._("\nDownload URL: ") + buildResults.url;
  if (buildResults.ota_url) {
    message = createMessageWithOtaUrl(message, buildResults);
  }
  doDownload(params, buildResults.url, cb, buildResults, message);
}
/**
 * Perform the build
 * @param params
 * @param cb
 */
function doBuild(params, cb) {
  var message = "";
  var doCall = function() {
    params.generateSrc=false;
    common.doApiCall(fhreq.getFeedHenryUrl(), createUri(params), params, i18n._("Error reading app: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      var keys = [];
      if (data.cacheKey) {
        keys.push(data.cacheKey);
      }
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
              if (params.json) {
                return cb(null, buildResults);
              }
              doConsoleMessage(message, buildResults, params, cb);
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


/**
 * Create the URL of the built artifact
 * @param buildResults
 * @param cb
 * @returns {*}
 */
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


/**
 * Download the app if the download param is === true
 * @param params
 * @param assetUrl
 * @param path
 * @param cb
 * @returns {*}
 */
function downloadBuild(params, assetUrl, path, cb) {
  if (params.download !== 'true') {
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