module.exports = account;

account.usage = "\n fhc account upload-resource <destination> <file path> <resource type> <config>"
  + "\n where <destination> is one of : android, iphone or blackberry"
  + "\n where <file path> is the absolute path of the file to upload"
  + "\n where <resource> is one of : certificate (used by iphone and android), privatekey (used by iphone and android), csk or db (used by Blackberry)"
  + "\n where <config> is one of : debug or distribution (required if destination is iphone, default is debug)"
  + "\n or"
  + "\n fhc account upload-resources-batch <destination> <resource directory>"
  + "\n where <destination> is one of : android, iphone, blackberry or all"
  + "\n where <resource directory> should be the directory where resources are located."
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
  + "\n    |--sigtool.db";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');

function account(args, cb){
  if(args.length < 3){
    unknown(action, cb);
  }
  var action = args.shift();
  switch(action){
    case "upload-resource" : return uploadResource(args[0], args[1], args[2], args[3]||"development", cb);
    case "upload-resources-batch" : return uploadResourcesBatch(args[0], args[1], cb);
    default: return unknown(action, cb);
  }
} 

function uploadResource(destination, filepath, type, config, cb){
  path.exists(filepath, function(exists){
    if(!exists){
      return cb("Can not find file : " + filepath);
    };
    destination = destination.toLowerCase();
    if(destination !== "iphone" && destination !== "android" && destination != "blackberry"){
      return cb("Unknown destination : " + destination);
    };
    
    if(!type){
      throw new Error("Missing resource type");
    };
    
    switch(destination){
      case "iphone": validateIphoneParams(type, config); break;
      case "android": validateAndroidParams(type); break;
      case "blackberry": validateBBParams(type); break;
      default: ''; 
    };
    log.info("Uploading resource : path : " + filepath + ", destination : " + destination + ", config : " + config + ", type : " + type);
    var url = "/box/srv/1.1/dev/account/res/upload";
    var fields = getFields(destination, type, config);
    fhreq.uploadFile(url, filepath, fields, "application/octet-stream", function(err, data){
      log.verbose("Got Response : " + JSON.stringify(data));
      return cb(err, data);
    });
  });
}

function uploadResourcesBatch(destination, filepath, cb){
  path.exists(filepath, function(exists){
    if(!exists){
      return cb("Can not find directory " + filepath);
    }
    fs.stat(filepath, function(err, fstat){
      if(err){
        return cb(err);
      }
      if(fstat.isFile()){
        return cb(filepath + " is a file. Please use 'fhc account upload-resource' instead.");
      }
      walkFiles(filepath, function(err, allfiles){
        if(err){
          return cb(err);
        }
        var fileTypes = {};
        for(var i=0;i<allfiles.length;i++){
          var file = allfiles[i];
          var dest = "";
          if(destination === "all"){
            dest = getDestination(file);
          } else {
            dest = destination;
          }
          if(dest === "iphone" || dest === "android" || dest === "blackberry"){
            var config = "distribution";
            if(dest === "iphone"){
              config = getConfig(file);
            }
            var fileType = getFileType(file);
            if(fileType != ""){
              fileTypes[dest] = fileTypes[dest] || {};
              fileTypes[dest][config] = fileTypes[dest][config] || {};
              fileTypes[dest][config][fileType] = fileTypes[dest][config][fileType] || [];
              fileTypes[dest][config][fileType].push(file);
            };
          };
        };
        var filesToUpload = [];
        for(var dest in fileTypes){
          for(var config in fileTypes[dest]){
            for(var filetype in fileTypes[dest][config]){
              if(fileTypes[dest][config][filetype].length > 1){
                log.warn("Found more than 1 resources for destination " + dest + " , config : " + config + " , type : " + filetype + ". Ignored.");
              } else {
                filesToUpload.push((function(path, dest, config, filetype){
                  return function(callback){
                    uploadResource(dest,path,filetype,config, function(err, data){
                      callback(err, data);
                    });
                  }
                })(fileTypes[dest][config][filetype][0], dest, config, filetype));
              }
            }
          }
        }
        async.series(filesToUpload, function(err, results){
          cb(err, "Done");
        });
      });
    })
  })  
}

function walkFiles(filepath, cb){
  var results = [];
  fs.readdir(filepath, function(err, list) {
    if (err) {
      return cb(err);
    }
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) {
         return cb(null, results);
      }
      file = filepath + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walkFiles(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if(validFile(file)){
            results.push(file);
          }
          next();
        }
      });
    })();
  });
}

function validFile(file){
  return !(path.basename(file).charAt(0) === ".");
}

function getFileType(file){
  var filename = path.basename(file);
  var extname = path.extname(filename);
  if(filename.indexOf('certificate') != -1 || extname === ".cer" || extname === ".cert"){
    return "certificate";
  }
  else if(filename.indexOf('private') != -1 || extname === ".privatekey"){
    return "privatekey";
  }
  else if(extname === ".csk"){
    return "csk";
  }
  else if(extname === ".db"){
    return "db";
  } else {
    return "";
  }
}

function getDestination(file){
  var parts = file.split("/");
  var dest = "";
  for(var i=0;i<parts.length;i++){
    var folder = parts[i].toLowerCase();
    if(folder === 'ios' || folder === 'iphone'){
      dest = "iphone";
      break;
    }
    if(folder === "android"){
      dest = "android";
      break;
    }
    if(folder === "blackberry"){
      dest = "blackberry";
      break;
    }
  }
  return dest;
}

function getConfig(file){
  var parts = file.split('/');
  var config = "distribution";
  for(var i=0;i<parts.length;i++){
    var folder = parts[i].toLowerCase();
    if(folder === "development" || folder === "debug"){
      config = "debug";
      break;
    }
  }
  return config;
}


function validateIphoneParams(type, config){
  if(type !== "certificate" && type !== "privatekey"){
    throw new Error("Invalid resource type for iphone : " + type + ". It should be either certificate or privatekey");
  }
  if(config && config !== "debug" && config !== "distribution"){
    throw new Error("Invalid resource config for iphone : " + config + ". It should be either debug or distribution");
  }
}

function validateAndroidParams(type){
  if(type !== "certificate" && type !== "privatekey"){
    throw new Error("Invalid resource type for android : " + type + ". It should be either certificate or privatekey");
  }
}

function validateBBParams(type){
  if(type !== "csk" && type !== "db"){
    throw new Error("Invalid resource type for blackberry : " + type + ". It should be either csk or db");
  }
}

function getFields(destination, type, config){
  var conf = config;
  if(destination !== "iphone"){
    conf = "distribution";
  }
  return {
    dest: destination,
    resourceType: type,
    buildType: conf
  }
}

function unknown(action, cb){
  cb("Usage: \n" + account.usage);
}
