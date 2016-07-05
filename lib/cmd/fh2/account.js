/* globals i18n */
module.exports = account;

account.desc = i18n._("Manage your FeedHenry Account Resources");
account.usage = "\n fhc account upload-resource <destination> <file-path> <resource-type> <config>"
  + i18n._("\n where <destination> is one of : android, iphone or blackberry"
           + "\n where <file-path> is the absolute path of the file to upload"
           + "\n where <resource> is one of : certificate (used by iphone and android), privatekey (used by iphone and android), csk or db (used by Blackberry)"
           + "\n where <config> is one of : debug or distribution (required if destination is iphone, default is debug)"
           + "\n or"
           + "\n fhc account upload-resources-batch <destination> <resource-directory>"
           + "\n where <destination> is one of : android, iphone, blackberry or all"
           + "\n where <resource-directory> should be the directory where resources are located."
           + "\n This command will try to find the correct type of resources for each destination and upload them automatically. "
           + "\n To do that, you should organize your resources in the following way: "
           + "\n  1. If the destination is all, each resource file should have one parent directory indicates its actual destination."
           + "\n  2. Each resource file should be better use the resource type as its extention or at lease part of the name."
           + "\n  3. Each resource file should have one parent directory indicate its destination."
           + "\n  4. For ios resources, each of them should have one parent directory indicate its config."
           + "\n  5. If more than 1 resource files found for one set of configuration, no file will be uploaded for that configuration."
           + "\n Example:"
           + "\n --Resources"
           + "\n  |--iphone"
           + "\n    |--debug"
           + "\n      |--developer.certificate"
           + "\n      |--developer.privatekey"
           + "\n  |--android"
           + "\n    |--developer.certificate"
           + "\n    |--developer.privatekey"
           + "\n  |--blackberry"
           + "\n    |--sigtool.csk"
           + "\n    |--sigtool.db"
           + "\n or"
           + "\n fhc account generate-resource <destination> <resource-type> <password>"
           + "\n where <destination> is one of android or iphone (not supported yet)"
           + "\n where <resource-type> is one of certificate or csr (certificate signing request, not supported yet)"
           + "\n where <password> is the password used to encrypt the private key (required)");

var log = require("../../utils/log");
var fhreq = require("../../utils/request");
var common = require("../../common");
var async = require('async');
var path = require('path');
var fs = require('fs');
var prompt = require('../../utils/prompt');
var _ = require('underscore');
var util = require('util');

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

function account(argv, cb) {
  var args = argv._;
  var action = args.shift();
  if (args.length < 2) {
    return unknown(action, cb);
  }
  switch (action) {
    case "upload-resource" :
      return uploadResource(args[0], args[1], args[2], args[3] || "development", cb);
    case "upload-resources-batch" :
      return uploadResourcesBatch(args[0], args[1], cb);
    case "generate-resource":
      return generateResource(args[0], args[1], args[2], cb);
    default:
      return unknown(action, cb);
  }
}

function uploadResource(destination, filepath, type, config, cb) {
  fs.exists(filepath, function (exists) {
    if (!exists) {
      return cb(i18n._("Can not find file : ") + filepath);
    }
    destination = destination.toLowerCase();
    if (destination !== "iphone" && destination !== "android" && destination !== "blackberry") {
      return cb(i18n._("Unknown destination : ") + destination);
    }

    if (!type) {
      throw new Error(i18n._("Missing resource type"));
    }

    switch (destination) {
      case "iphone":
        validateIphoneParams(type, config);
        break;
      case "android":
        validateAndroidParams(type);
        break;
      case "blackberry":
        validateBBParams(type);
        break;
      default:
        break;
    }
    log.info(util.format(i18n._("Uploading resource : path : %s, destination : %s, config : %s, type : %s"),
                         filepath, destination, config, type));
    var url = "/box/srv/1.1/dev/account/res/upload";
    var fields = getFields(destination, type, config);
    fhreq.uploadFile(url, filepath, fields, "application/octet-stream", function (err, data) {
      return cb(err, data);
    });
  });
}

function uploadResourcesBatch(destination, filepath, cb) {
  fs.exists(filepath, function (exists) {
    if (!exists) {
      return cb(i18n._("Can not find directory ") + filepath);
    }
    fs.stat(filepath, function (err, fstat) {
      if (err) {
        return cb(err);
      }
      if (fstat.isFile()) {
        return cb(util.format(i18n._("%s is a file. Please use 'fhc account upload-resource' instead."), filepath));
      }
      walkFiles(filepath, function (err, allfiles) {
        if (err) {
          return cb(err);
        }
        var fileTypes = {};
        for (var i = 0; i < allfiles.length; i++) {
          var file = allfiles[i];
          var dest = "";
          if (destination === "all") {
            dest = getDestination(file);
          } else {
            dest = destination;
          }
          if (dest === "iphone" || dest === "android" || dest === "blackberry") {
            var config = "distribution";
            if (dest === "iphone") {
              config = getConfig(file);
            }
            var fileType = getFileType(file);
            if (fileType !== "") {
              fileTypes[dest] = fileTypes[dest] || {};
              fileTypes[dest][config] = fileTypes[dest][config] || {};
              fileTypes[dest][config][fileType] = fileTypes[dest][config][fileType] || [];
              fileTypes[dest][config][fileType].push(file);
            }
          }
        }
        var uploadTasks = [];
        _.each(fileTypes, function (cfgs, destination) {
          _.each(cfgs, function (types, cfg) {
            _.each(types, function (paths, filetype) {
              if (paths.length > 1) {
                return log.warn(util.format(i18n._("Found more than 1 resources for destination %s, config : %s, type : %s. Ignored."),
                                            destination, cfg, filetype));
              }
              var path = paths[0];
              uploadTasks.push(function (callback) {
                uploadResource(destination, path, filetype, cfg, callback);
              });
            });
          });
        });
        async.series(uploadTasks, function (err) {
          cb(err, i18n._("Done"));
        });
      });
    });
  });
}

function generateResource(dest, type, password, cb) {
  var genFunc = function (resType, destination, pass) {
    var genUrl = "box/srv/1.1/dev/account/res/generate";
    common.doApiCall(fhreq.getFeedHenryUrl(), genUrl, {
      type: resType,
      dest: destination,
      password: pass
    }, i18n._("Error generating account resource:"), function (err, res) {
      log.silly(util.format(i18n._("Response of generating resource %s for %s : "), resType, destination) + JSON.stringify(res));
      if (res.result === "ok") {
        return cb(undefined, i18n._("Done"));
      }
      if (res.error) {
        return cb(res.error);
      }
    });
  };
  if (dest.toLowerCase() === "android") {
    var listUrl = "box/srv/1.1/dev/account/res/list";
    common.doApiCall(fhreq.getFeedHenryUrl(), listUrl, {"dest": "android"}, i18n._("Error listing account resources:"), function (err, res) {
      var distCertFound = _.find(res.certificates, function (cert) {
        return cert.type === "distribution";
      });
      if (distCertFound) {
        prompt(i18n._("Warning: Found an existing distribution certificate for Android in your account. It will be overwritten and can not be recovered. Are you sure you want to continue ? \n (Y/N):"), "", false, function (er, val) {
          if (val.toLowerCase() === "y" || val.toLowerCase() === "yes") {
            genFunc("certificate", dest, password);
          } else {
            return cb(undefined, "Aborted");
          }
        });
      } else {
        genFunc("certificate", dest, password);
      }
    });
  } else {
    return cb(util.format(i18n._("Destination %s is not supported at the moment. "), dest));
  }
}

function walkFiles(filepath, cb) {
  var results = [];
  fs.readdir(filepath, function (err, list) {
    if (err) {
      return cb(err);
    }
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) {
        return cb(undefined, results);
      }
      file = filepath + '/' + file;
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walkFiles(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (validFile(file)) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
}

function validFile(file) {
  return !(path.basename(file).charAt(0) === ".");
}

function getFileType(file) {
  var filename = path.basename(file);
  var extname = path.extname(filename);
  if (filename.indexOf('certificate') !== -1 || extname === ".cer" || extname === ".cert") {
    return "certificate";
  }
  else if (filename.indexOf('private') !== -1 || extname === ".privatekey") {
    return "privatekey";
  }
  else if (extname === ".csk") {
    return "csk";
  }
  else if (extname === ".db") {
    return "db";
  } else {
    return "";
  }
}

function getDestination(file) {
  var folders = file.split(path.sep);
  for (var i = 0; i < folders.length; i++) {
    var folder = folders[i].toLowerCase();
    if (folder === 'ios' || folder === 'iphone') {
      return "iphone";
    }
    if (folder === "android") {
      return "android";
    }
    if (folder === "blackberry") {
      return "blackberry";
    }
  }
}


function getConfig(file) {
  var parts = file.split(path.sep);
  var config = "distribution";
  for (var i = 0; i < parts.length; i++) {
    var folder = parts[i].toLowerCase();
    if (folder === "development" || folder === "debug") {
      config = "debug";
      break;
    }
  }
  return config;
}


function validateIphoneParams(type, config) {
  if (type !== "certificate" && type !== "privatekey") {
    throw new Error(util.format(i18n._("Invalid resource type for iphone : %s. It should be either certificate or privatekey"), type));
  }
  if (config && config !== "debug" && config !== "distribution") {
    throw new Error(util.format(i18n._("Invalid resource config for iphone : %s. It should be either debug or distribution"), config));
  }
}

function validateAndroidParams(type) {
  if (type !== "certificate" && type !== "privatekey") {
    throw new Error(util.format(i18n._("Invalid resource type for android : %s. It should be either certificate or privatekey"), type));
  }
}

function validateBBParams(type) {
  if (type !== "csk" && type !== "db") {
    throw new Error(util.format(i18n._("Invalid resource type for blackberry : %s. It should be either csk or db"), type));
  }
}

function getFields(destination, type, config) {
  var conf = config;
  if (destination !== "iphone") {
    conf = "distribution";
  }
  return {
    dest: destination,
    resourceType: type,
    buildType: conf
  };
}

function unknown(action, cb) {
  cb(i18n._("Usage: \n") + account.usage);
}
