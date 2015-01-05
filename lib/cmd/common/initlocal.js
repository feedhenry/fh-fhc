module.exports = initlocal;
initlocal.initlocal = initlocal;
initlocal.getEnvVars = getEnvVariables;

initlocal.usage = "fh initlocal [project-id] <app-id>";
initlocal.desc = "Initialises Local Server files For Local Development";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require('child_process').exec;
var millicore = require("../../utils/millicore.js");
var ini = require('../../utils/ini');
var Table = require('cli-table');
var cheerio = require('cheerio');
var env = require('./env.js');

var localDirectory = ".fhclocal";
var local = {
  protocol: 'http',
  hostname: '127.0.0.1',
  port: 8000
};

var applicationJS = './cloud/application.js';
var defaultApplicationJS = [
  'var nodeapp = require("fh-nodeapp");',
  'nodeapp.HostApp.init();',
  'nodeapp.HostApp.serveApp(require("main.js"));'
].join("\n");

var initResponse = {
  "domain": "DOMAIN",
  "firstTime": false,
  "hosts": {
    "debugCloudType":   "node",
    "debugCloudUrl":    "REPLACE_CLOUD_HOST",
    "releaseCloudType": "node",
    "releaseCloudUrl":  "REPLACE_CLOUD_HOST"
  },
  "status": "ok"
}

// Main read entry point
function initlocal (argv, cb) {
  var args = argv._;
  
  if (args.length === 0){
    return cb(initlocal.usage);
  }

  var projectId, appId;
  if (args.length === 1) {
    appId = fhc.appId(args[0]);
  }
  if (args.length === 2) {
    projectId = fhc.appId(args[0]);
    appId = fhc.appId(args[1]);
  }
  return doInitLocal(projectId, appId, cb);
}

function localHostUrl() {
  var uri = {
    protocol: local.protocol,
    hostname: local.hostname,
    port: local.port
  };
  return url.format(uri);
}

function calculateLocalScriptPath(scriptSrc, localDirectory) {
  var uri = url.parse(scriptSrc);
  uri.protocol = local.protocol;
  uri.host = undefined;
  uri.hostname = local.hostname;
  uri.port = local.port;
  uri.pathname = path.join(localDirectory, path.basename(uri.pathname));

  var localPath = url.format(uri);
  log.silly('Translated app container url: ' + scriptSrc + ', to local url: ' + localPath);
  return localPath;
}

function downloadContainerFile(origPath, localPath, cb) {
  fhreq.GET(origPath, origPath, function (err, remoteData, raw, respose) {
    if (err) return cb(err);
    var uri = url.parse(localPath);
    if (!raw) {
      raw = '';
    }
    log.verbose('Downloaded container file: ' + origPath, 'download script');
    fs.writeFile('.' + uri.pathname, raw, function (err) {
      if (err) return cb(err);
      return cb(undefined, "Files Saved.");
    });
  });
}

function setBodyToPlaceholder(appContainer, cb) {
  appContainer('body').text('REPLACE_BODY_HERE');
  return cb(undefined, appContainer);
}

function modifyTagsToLocal(appContainer, tagsToModify, localDirectory, cb) {
  var fileList = [];
  tagsToModify.forEach(function (el, i, ary) {
    appContainer(el.tag).each(function (i, elem) {
      if (this.attr) {
        var scriptSrc = this.attr(el.attr);
        if (scriptSrc) {
          var localScriptPath = calculateLocalScriptPath(scriptSrc, localDirectory);
          fileList.push({origPath: scriptSrc, localPath: localScriptPath});
          this.attr(el.attr, localScriptPath);
        }
      }
    });
  });
  return cb(undefined, appContainer, fileList);
}

function constructContainerFromIndex(indexFile, cb) {
  var outputFile;
  var err;

  var appContainer = cheerio.load(indexFile);
  setBodyToPlaceholder(appContainer, function (err, appContainer) {
    if (err) return cb(err);
    var tagsToModify = [
      {tag: "script", attr: "src"},
      {tag: "link",   attr: "href"}
    ];

    modifyTagsToLocal(appContainer, tagsToModify, localDirectory, function (err, appContainer, fileList) {
      if (err) return cb(err);
      var hostRegExp = new RegExp('"host"\\s*:\\s*"' + fhreq.getFeedHenryUrl() + '?"');
      outputFile = appContainer.html().replace(hostRegExp, '"host":"' + localHostUrl() + '"');
      return cb(err, outputFile, fileList);
    });
  });
}

function writeFileToLocalDirectory(localDirectory, fileName, outputData, cb) {
  fs.exists(localDirectory, function(exists) {
    var err;
    if (!exists) {
      err = fs.mkdirSync(localDirectory);
    }
    if (err) return cb(err);
    fs.writeFile(path.join(localDirectory, fileName), outputData, cb);
  });
}

function createLocalDirectory(localDirectory, cb) {
  fs.exists(localDirectory, function(exists) {
    var err;
    if (!exists) {
      err = fs.mkdirSync(localDirectory);
    }
    return cb(err);
  });
}

function checkApplicationJS(applicationJSFile, cb) {
  if (!fs.existsSync(applicationJSFile)) {
    log.warn("No existing application.js file, creating", "application.js");
    fs.writeFile(applicationJSFile, defaultApplicationJS, cb);
  } else {
    cb();
  }
};

function installFhDbLocally(cb) {
  exec('npm install fh-db', function(err, stdout, stderr) {
    log.silly("npm install fh-db stdout", stdout);
    log.silly("npm install fh-db stderr", stderr);
    if (err) return cb("Error installing fh-db locally - " + util.inspect(err) + " - " + stderr);
    return cb();
  });
};

function loadEnvVariables(localdir, appId, cb){
  env.list(appId, "dev", function(err, data){
    if(err) return cb(err);
    var envVars = {};
    if(data.list && data.list.length > 0){
      for(var i=0;i<data.list.length;i++){
        var fields = data.list[i].fields;
        envVars[fields.name] = fields.devValue;
      }
    }
    writeFileToLocalDirectory(localdir, "envvar.json", JSON.stringify(envVars), function(err, result){
      if(err) return cb(err);
      return cb(null, envVars);
    });
  });
}

function getEnvVariables(appId, cb){
  if(!appId){
    appId = getAppId();
  }
  var envvarFilePath = path.join(localDirectory, "envvar.json");
  //will always try load data from remote first
  loadEnvVariables(localDirectory, appId, function(err, envVars){
    if(err){
      //can not load from remote, try read the local file
      if(fs.existsSync(envvarFilePath)){
        fs.readFile(envvarFilePath, "utf8", function(err, data){
          if(err) return cb(err);
          return cb(null, JSON.parse(data));
        });
      } else {
        console.log("No environment variables set.");
        return cb(null, {});
      }
    } else {
      return cb(null, envVars);
    }
  });
}

function getAppId(){
  var container, appId;
  var p = localDirectory + "/container.html";
  if(fs.existsSync(p)){
    container = fs.readFileSync(p, "utf8");
    var re = new RegExp('"appid"\\s*:\\s*"(.{24})"');
    if(re.test(container)){
      appId = re.exec(container)[1];
    }
  }
  return appId;
}

function doInitLocal (projectId, appId, cb) {
  if (!appId) return cb("No appId specified! Usage:\n" + initlocal.usage);
  log.silly('Getting app container from url: ' + fhreq.getFeedHenryUrl() + ", domain: " + fhc.curTarget, 'get container');
  common.readApp(projectId, appId, function (err, data) { // check valid appid
    if (err) return cb(err);
    installFhDbLocally(function (err) {
      if (err) return cb(err);
      createLocalDirectory(localDirectory, function (err) {
        if(err) return cb(err);
        checkApplicationJS(applicationJS, function(err) {
          if (err) return cb(err);
          common.getAppContainer(appId, function(err, data) {
            if (err) return cb(err);
            constructContainerFromIndex(data, function (err, outputFile, fileList) {
              if (err) return cb(err);
              async.forEach(fileList, function (item, cb) {
                downloadContainerFile(item.origPath, item.localPath, cb);
              }, function (err) {
                if(err) return cb(err);
                writeFileToLocalDirectory(localDirectory, "container.html", outputFile, function (err) {
                  if (err) return cb(err);
                  log.info('Downloaded client App container file and ' + fileList.length + ' script files', 'Finished.');
                  initResponse.domain = fhc.curTarget;
                  writeFileToLocalDirectory(localDirectory, "initResponse.json", JSON.stringify(initResponse), function (err) {
                    if(err) return cb(err);
                    return cb(undefined, "Files Saved.");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

// bash completion
initlocal.completion = function (opts, cb) {
  common.getAppIds(cb);
};
