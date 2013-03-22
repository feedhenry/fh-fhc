"use strict";

module.exports = local;

local.usage = ["",
               " fhc local <appID>",
               " This command (or the equivalent 'fhc initlocal <appID>') must be run at least",
               " once to initialize the local service. Note : this call will start the local",
               " client and cloud with the default host(127.0.0.1) and ports(8000/8001)",
               "",
               " fhc local <appID>* <cloudHost=host> <cloudPort=port>  <port=port> ",
               " where <appID> is the application id (aside from the initial call this parameter is optional)",
               " where <cloudHost> is the ip address or hostname you want to listen",
               "       on (additionally we will generate urls with this host). Normally you ",
               "       would want to set this value if you want to access the cloud/client from ",
               "       a mobile device over your local router or through a public address. Note :",
               "       this address is used for bloth your cloud and client urls.",
               " where <cloudPort> is the port that your cloud code uses for act calls (default : 8001). You ",
               "       would only need to change this from the default if it clashes with" ,
               "       another service",
               " where <port> is the port that serves your client content.(default : 8000). You would normally ",
               "       only need to change this port if it clashes with another service. Or ",
               "       you want to run another package",
               ""
              ].join("\n");

var http = require("http"),
  https = require("https"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  util = require("util"),
  events = require("events"),
  common = require("./common"),
  initlocal = require("./initlocal"),
  log = require("./utils/log"),
  fhc = require("./fhc"),
  hosts = require("./hosts"),
  spawn = require('child_process').spawn,
  async = require('async'),
  mime = require("mime");
var packages = [];
var defaultPackage = 'default';
var clientDir = "./client";
var sharedDir = "./shared";
var fhcLocalDir = ".fhclocal";
var cloudAddress = "http://127.0.0.1:8001";
var localAddress = "http://127.0.0.1:8000";

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

var defaultArgs = {
  port: {
    required: true,
    val: 8000,
    type: "number"
  },
  cloudHost: {
    required: true,
    val: "http://127.0.0.1",
    type: "string"
  },
  cloudPort: {
    required: true,
    val: 8001,
    type: "number"
  },
  startCloud: {
    required: true,
    val: true,
    type: "boolean"
  },
  debug: {
    required: false,
    val: false,
    type: "boolean"
  },
  debugBrk: {
    required: false,
    val: false,
    type: "boolean"
  },
  redisHost: {
    required: true,
    val: "127.0.0.1",
    type: "string"
  },
  redisPort: {
    required: true,
    val: 6379,
    type: "number"
  },
  redisPassword: {
    required: false,
    val: "",
    type: "string"
  },
  packages: {
    required: false,
    val: "",
    type: "string"
  },
  localDB: {
    required: true,
    val: "true",
    type: "boolean"
  },
  decoupled: {
    required: false,
    val: false,
    type: "boolean"
  }
};

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

function tryParse(data, defaultVal) {
  var res;
  try {
    res = JSON.parse(data);
  }
  catch(e) {
    res = defaultVal;
  }
  return res;
}

function validateArgs(args) {
  for(var i in defaultArgs) {
    var defaultArg = defaultArgs[i],
      currentArg = args[i];
    
    if(args[i] === undefined) {
      if(defaultArg.required) {
        if(!defaultArg.val) {
          throw new Error("Missing '" + i + "' parameter");
        }
        else if(defaultArg.val) {
          currentArg = args[i] = defaultArg.val;
        }
      }
    }
    if(currentArg !== undefined) {
      switch(defaultArg.type) {
        case "boolean":
          args[i] = typeof currentArg === "boolean" ? currentArg : currentArg === "true" ? true : false;
          break;
        case "array":
          args[i] = currentArg.split(defaultArg.delim || ",");
          break;
        case "guid":
          args[i] = fhc.appId(currentArg);
          break;
        case "number":
          args[i] = parseInt(currentArg, 10);
          break;
      }
    }
  }
}

function exec_cmd(cmd, args, cwd, env, cb) {
  var last_error_output = "";
  var spawn_options;
  if(cwd || env) {
    spawn_options = {};
    if(cwd) {
      spawn_options.cwd = cwd;
    }
    if(env) {
      var myEnv = process.env;
      for(var e in env) {
        myEnv[e] = env[e];
      }
      spawn_options.env = myEnv;
    }
  }

  var exec_process = spawn(cmd, args, spawn_options);

  exec_process.stdout.on('data', function (data) {
    console.log('CLOUD stdout: ' + data);
  });

  exec_process.stderr.on('data', function (data) {
    console.log('CLOUD stderr: ' + data);
    last_error_output = data;
  });

  exec_process.on('exit', function (code) {
    var err;
    if(code !=0 ) {
      err = new Error(last_error_output);
    }
    log.verbose('' + cmd + ': exited with code ' + code);
    if (cb) {
      return cb(err, code);
    }
  });
}

function npm_install(cwd, env, cb) {
  var executable = (process.platform === 'win32') ? 'npm.cmd' : 'npm';
  exec_cmd(executable, ['install'], cwd, env, cb);
}

function getPackagesList(str) {
  var pkgs
  if (str) {
    pkgs = str.split(',');
  } else {
    pkgs = [];
  }
  pkgs.push(defaultPackage);
  return pkgs;
}

function local(args, cb) {
  var argObj;
  var appid;
  try {
    // I'm going to assume the appId can't have a '=' and all the 
    // command line args do have '='
    if(args.length && !args[0].match(/=/)) {
      appid = args.splice(0,1);
      if(appid){
        appid = appid.toString();
      }
    }
    argObj = common.parseArgs(args);
    validateArgs(argObj);
    argObj.appid = appid;
    if(!argObj.cloudHost.match(/^http:/)) {
      argObj.cloudHost =  "http://" + argObj.cloudHost;
    }
    cloudAddress = argObj.cloudHost + ":" + argObj.cloudPort;
    localAddress = argObj.cloudHost + ":" + argObj.port;
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + local.usage);
  }
  var appEnvironment = {};
  if(!fs.existsSync(fhcLocalDir)) {
    if(!argObj.appid) {
      return cb("Error : 'fhc initlocal <appId>' or 'fhc local <appId>' never called, see the usage for an explanation.\n\nUsage: " + local.usage);
    }
  }
  async.series([
    function(callback) {
      if(!fs.existsSync(fhcLocalDir)) {
        console.log("Please wait while the local directory is initialized");
        initlocal.initlocal(argObj.appid, function(err, message) {
          if(!err){
            console.log("One time initialization complete.\nLaunching local services.");
          } else {
            console.log("Unexpected error during initialization. Is the guid '" + argObj.appid + "' correct?");
          }
          return callback(err);
        });
      } else {
        return callback();
      }
    },
    function(callback) {
      initlocal.getEnvVars(appid, function(err, envVars){
        if(err) return callback(err);
        appEnvironment = envVars;
        return callback();
      });
    },
    function(callback) {
      packages = getPackagesList(argObj.packages);

      log.silly('Packages list: ' + JSON.stringify(packages), 'packages');

      if(argObj.startCloud) {
        // parameters are passed to the app in the process environment
        appEnvironment['NODE_PATH'] = (process.platform === 'win32') ? './cloud;./shared' : './cloud:./shared';
        appEnvironment['FH_PORT'] = argObj.cloudPort;
        appEnvironment['FH_REDIS_HOST'] = argObj.redisHost;
        appEnvironment['FH_REDIS_PORT'] = argObj.redisPort;

        if (argObj.redisPassword) {
          appEnvironment['FH_REDIS_PASSWORD'] = argObj.redisPassword;
        }

        if (argObj.localDB) {
          appEnvironment['FH_USE_LOCAL_DB'] = "true";
        }

        if(!(fs.existsSync('./cloud/application.js') && (fs.existsSync('./cloud/package.json')))) {
          return callback(new Error("running local requires application.js and package.json in your cloud code"));
        }

        npm_install('./cloud', undefined, function (err, code) {
          if(err || (code > 0)) {
            return callback(err);
          }
	  var node_args = [];
	  if (argObj.debugBrk) {
	    node_args.push("--debug-brk");
	    console.log("Starting cloud code with debug enabled, you will need to connect a debugger");
	  } else if (argObj.debug) {
	    node_args.push("--debug");
	    console.log("Starting cloud code with debug enabled, you may connect a debugger");
	  }
	  node_args.push('./cloud/application.js');
          exec_cmd('node', node_args, process.cwd(), appEnvironment, function (err, code) {
            log.error('cloud application exitted.');
            if(clientServer) {
              clientServer.close();
            }
            if(err) {
              log.error(err);
            } else {
              log.error('exit code: ', code);
            }
          });
        });
      }

      var clientServer = http.createServer(function(request, response) {
        handlClientRequest(request, response, argObj);
      });

      try {
        clientServer.listen(argObj.port);
      }
      catch(e) {
        return callback(e);
      }
      console.log("Serving App files on port: " + argObj.port);
      console.log("go to " + argObj.cloudHost + ":" + argObj.port + "/ in your browser");

    }], function(err, results) {
      return cb(err);
    });
}

function getMimeType(fileName) {
  var retVal = mime.lookup(fileName) || "text/plain";
  log.silly('mimetype for ' + fileName + ' is ' + retVal);
  return retVal;
}

function startsWith(str, query) {
  return str.indexOf(query) === 0;
}

// construct list of possible filenames based on package order
// include paths with the default filename attached (i.e. index.html)
function producePossiblePathNames(clientDir, sharedDir, packages, uri, defaultFileName)
{
  var possiblePathNames = [];
  var i;

  for (i = 0; i < packages.length; i += 1) {
    var packageName = packages[i];
    possiblePathNames.push(path.join(clientDir, packageName, uri, defaultFileName));
    possiblePathNames.push(path.join(clientDir, packageName, uri));
  }
  possiblePathNames.push(path.join(sharedDir, uri));

  return possiblePathNames;
}

function resolveFileName (uri, cb) {
  var defaultFile = 'index.html';
  async.waterfall([
    function (callback) {
      var result;
      if (uri.indexOf("/box") >= 0 ) {
        log.silly("Received app init mesasge.");
        result = path.join('./.fhclocal/', 'initResponse.json');
      }
      return callback(undefined, result);
    },
    function (input, callback) {
      var result = input;
      if(!result) { // if already found, don't need to try this
        if (startsWith(uri, "/.fhclocal/")) {
          result = path.join(".", uri);
          log.silly('Container file requested: ');
        }
      }
      return callback(undefined, result);
    },
    function (input, callback) {
      var result = input;
      if(result) { // if already found, don't need to try this
        return callback(undefined, result);
      }

      var possiblePathNames = producePossiblePathNames(clientDir, sharedDir, packages, uri, defaultFile);
      async.detectSeries(possiblePathNames, function (file, callback) {
        fs.stat(file, function (err, stats) {
          return callback(!err && stats && stats.isFile());
        });
      }, function (resultFile) {
        log.verbose('App client file requested: ' + resultFile);
        return callback(undefined, resultFile);
      });
    }
  ], function(err, fileName) {
    if (err) cb(err);
    return cb((fileName)?true:false, fileName);
  });
}

var handlClientRequest = function(request, response, options) {
  var self = this,
    requestParams = url.parse(request.url, true),
    uri = requestParams.pathname;

  resolveFileName(uri, function (fileExists, fileName) {
    log.silly("Resolved file: " + fileName + ", " + (fileExists?"exists":"does not exist"));
    if (!fileExists) {
      response.writeHead(404);
      return response.end("Not found\n");
    }
    response.setHeader("Content-Type", getMimeType(fileName));
    var fileStream;
    if (path.basename(fileName) === "index.html") {
      var appIndex = fs.readFileSync(fileName, 'utf8');

      if (options.decoupled) {
        log.silly("App index served without wrapping");
        return response.end(appIndex);
      }

      var container = fs.readFileSync(path.join(".fhclocal", "container.html"), "utf8");
      container = container.replace(/http:\/\/127\.0\.0\.1:8000/g, localAddress);
      container = container.replace("REPLACE_BODY_HERE", appIndex);
      log.silly("App index.html inserted into container");
      response.end(container);
    } else if (path.basename(fileName) === "initResponse.json") {
      var initResp = fs.readFileSync(path.join(".fhclocal", "initResponse.json"), "utf8");
      initResp = initResp.replace(/REPLACE_CLOUD_HOST/g, cloudAddress);
      log.silly("Using " + cloudAddress + " as cloud host");
      response.end(initResp);
    } else {
      fileStream = fs.createReadStream(fileName);
      util.pump(fileStream, response);
    }
  });
};

// bash completion
local.completion = function (opts, cb) {
  common.getAppIds(cb);
};

