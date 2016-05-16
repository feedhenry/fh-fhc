/* globals i18n */
module.exports = local;
local.desc = i18n._("Creates Local Server For Local Development");
local.usage = ["",
  " fhc local <cloud_MBaaS_instance_id>",
  i18n._(" This command (or the equivalent 'fhc initlocal <appID>') must be run at least\n",
         + " once to initialize the local service. Note : this call will start the local\n",
         + " client and cloud with the default host(127.0.0.1) and ports(8000/8001)"),
  "",
  " fhc local <appID>* [options]",
  i18n._(" where <appID> is the application id (aside from the initial call this parameter is optional)"),
  "",
  i18n._(" Valid options including: "),
  i18n._("   fh3 : is this a FeedHenry 3 project. Default value is false. If true, packages & shared folder logic will be ignored (as these are depricated in FH3)"),
  i18n._("   clientDir : the directory containing the client code to execute. Default value is ./client. Useful in FeedHenry 3 where client and cloud are separate git repos"),
  i18n._("   clientHost : the ip address or hostname used for serving the client code. Default value is http://127.0.0.1. Specify the ip address or the host name of the server if you want to test client from a mobile device."),
  i18n._("   clientPort : the port that serves your client content. Default value is 8000. "),
  i18n._("   cloudDir : the directory containing the cloud code to execute. Default value is ./cloud. Useful in FeedHenry 3 where client and cloud are separate git repos"),
  i18n._("   cloudHost : the ip address or hostname used for serving the cloud code. Default value is http://127.0.0.1. Specify the ip address or the host name of the server if you want to test cloud code from a mobile device. You can also specify remote cloud code to target for local client development (e.g. cloud code running in the FH cloud)"),
  i18n._("   cloudPort : the port number used for serving the cloud code. Default value is 8001."),
  i18n._("   startCloud : should the cloud code started automatically. Default value is true."),
  i18n._("   debug : turn on debugger for Node Inspector. Default value is false."),
  i18n._("   debugBrk : pause the script on the first line for the Node Inspector. Default value is false."),
  i18n._("   redisHost : specify the host name or ip address for the redis server. Default value is 127.0.0.1."),
  i18n._("   redisPort : specify the port number for the redis server. Default value is 6379."),
  i18n._("   redisPassword : specify the password for the redis server if authentication is required."),
  i18n._("   packages: which client folder should be loaded for the client app. The default value is 'default' means it will load from 'client/default' folder, specify a different value if you want to load from another client folder."),
  i18n._("   localDB : specify if local MongoDB should be used. Default value is true."),
  i18n._("   decoupled : specify if the client app is decoupled. For decoupled build, there will be no wrappers around the conents in index.html file. Default value is false."),
  i18n._("   logprefix : indicate whether stdout and stderr messages should be prefixed, Default value is false."),
  i18n._("   loghighlight : indicate whether stdout and stderr messages should be output in green or red color text respectively. Default value is true."),
  i18n._("   openClient : indicates whether the client URL (typically http://127.0.0.1:8000) should be opened in the default browser when fhc local starts. Default value is false."),
  i18n._(" Examples : "),
  "   fhc local fh3=true client=./my-project-client-app cloud=./my-project-cloud-app/cloud",
  "   fhc local clientHost=http://192.168.28.34 clientPort=9000 cloudHost=http://192.168.28.34 cloudPort=9001",
  "   fhc local startCloud=false",
  "   fhc local packages=app",
  "   fhc local debug=true debugBrk=true redisHost=192.168.28.33 redisPort=10001 decoupled=true",
  i18n._(" For more details, please run"),
  "   fhc help local",
  ""
].join("\n");

var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  util = require("util"),
  common = require("../../common"),
  initlocal = require("./initlocal"),
  log = require("../../utils/log"),
  fhc = require("../../fhc"),
  spawn = require('child_process').spawn,
  async = require('async'),
  mime = require("mime");
var open = require("open");
var _ = require('underscore');
var packages = [];
var defaultPackage = 'default';
var sharedDir = "./shared";
var fhcLocalDir = ".fhclocal";
var cloudAddress = "http://127.0.0.1:8001";
var localAddress = "http://127.0.0.1:8000";
var stdOutPrefix = '';
var stdErrPrefix = '';
var doLogHighlight = false;

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;

var defaultArgs = require('./data/localDefaultArgs');

function validateArgs(args) {
  _.each(defaultArgs, function (defaultArg, i) {
    var currentArg = args[i];
    if (typeof args[i] === 'undefined' && defaultArg.required && !defaultArg.val) {
      throw new Error(util.format(i18n._("Missing '%s' parameter"), i));
    } else if (defaultArg.val) {
      currentArg = args[i] = defaultArg.val;
    }



    if (currentArg) {
      switch (defaultArg.type) {
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
        default:
          throw new Error(util.format(i18n._('Invalid type for parameter%s'), i));
      }
    }
  });
}

function execCmd(cmd, args, cwd, env, cb) {
  var lastErrorOutput = "";
  var spawnOptions;
  if (cwd || env) {
    spawnOptions = {};
    if (cwd) {
      spawnOptions.cwd = cwd;
    }
    if (env) {
      var myEnv = process.env;
      myEnv = _.extend(myEnv, env);
      spawnOptions.env = myEnv;
    }
  }

  var execProcess = spawn(cmd, args, spawnOptions);

  execProcess.stdout.on('data', function (data) {
    if (doLogHighlight) {
      console.log((stdOutPrefix + data).green);
    } else {
      console.log(stdOutPrefix + data);
    }
  });

  execProcess.stderr.on('data', function (data) {
    if (doLogHighlight) {
      console.log((stdErrPrefix + data).red);
    } else {
      console.log(stdErrPrefix + data);
    }
    lastErrorOutput = data;
  });

  execProcess.on('exit', function (code) {
    var err;
    if (code !== 0) {
      err = new Error(lastErrorOutput);
    }
    log.verbose('' + cmd + util.format(i18n._(': exited with code %s'), code));
    if (cb) {
      return cb(err, code);
    }
  });
}

function npmInstall(cwd, env, cb) {
  var executable = (process.platform === 'win32') ? 'npm.cmd' : 'npm';
  execCmd(executable, ['install'], cwd, env, cb);
}

function getPackagesList(str) {
  var pkgs;
  if (str) {
    pkgs = str.split(',');
  } else {
    pkgs = [];
  }
  pkgs.push(defaultPackage);
  return pkgs;
}

var handleClientRequest = function (request, response, options) {
  var  requestParams = url.parse(request.url, true),
    uri = requestParams.pathname;

  resolveFileName(uri, options, function (fileExists, fileName) {
    log.silly(i18n._("Resolved file: ") + fileName + ", " + (fileExists ? i18n._("exists") : i18n._("does not exist")));
    if (!fileExists) {
      response.writeHead(404);
      return response.end(i18n._("Not found\n"));
    }
    response.setHeader("Content-Type", getMimeType(fileName));
    var fileStream;
    if (path.basename(fileName) === "index.html") {
      var appIndex = fs.readFileSync(fileName, 'utf8');

      if (options.decoupled || options.fh3) {
        log.silly(i18n._("App index served without wrapping"));
        return response.end(appIndex);
      }

      var container = fs.readFileSync(path.join(".fhclocal", "container.html"), "utf8");
      container = container.replace(/http:\/\/127\.0\.0\.1:8000/g, localAddress);
      container = container.replace("REPLACE_BODY_HERE", appIndex);
      log.silly(i18n._("App index.html inserted into container"));
      response.end(container);
    } else if (path.basename(fileName) === "initResponse.json") {
      log.silly(util.format(i18n._("Using %s as cloud host"), cloudAddress));
      var initResp;
      if (options.fh3) {
        initResp = '{"hosts" : {"url" : "' + cloudAddress + '"}}';
      }
      else {
        initResp = fs.readFileSync(path.join(".fhclocal", "initResponse.json"), "utf8");
        initResp = initResp.replace(/REPLACE_CLOUD_HOST/g, cloudAddress);
      }
      response.end(initResp);
    } else {
      fileStream = fs.createReadStream(fileName);
      util.pump(fileStream, response);
    }
  });
};

function local(argv, cb) {
  var args = argv._;
  var argObj;
  var appid;
  try {
    // I'm going to assume the appId can't have a '=' and all the
    // command line args do have '='
    if (args.length && !args[0].match(/=/)) {
      appid = args.splice(0, 1);
      if (appid) {
        appid = appid.toString();
      }
    }
    argObj = common.parseArgs(args);
    validateArgs(argObj);
    argObj.appid = appid;
    if (!argObj.cloudHost.match(/^http:/) && !argObj.cloudHost.match(/^https:/)) {
      argObj.cloudHost = "http://" + argObj.cloudHost;
    }

    if (!argObj.clientHost.match(/^http:/) && !argObj.clientHost.match(/^https:/)) {
      argObj.clientHost = "http://" + argObj.clientHost;
    }

    cloudAddress = argObj.cloudHost + ":" + argObj.cloudPort;
    localAddress = argObj.clientHost + ":" + argObj.clientPort;

    stdOutPrefix = argObj.logprefix ? "CLOUD stdout: " : "";
    stdErrPrefix = argObj.logprefix ? "CLOUD stderr: " : "";

    doLogHighlight = argObj.loghighlight;

  } catch (x) {
    return cb(i18n._("Error processing args: ") + x + "\n" + i18n._("Usage: ") + local.usage);
  }
  var appEnvironment = {};
  if (!fs.existsSync(fhcLocalDir) && !argObj.appid) {
    return cb(i18n._("Error : 'fhc initlocal <appId>' or 'fhc local <appId>' never called, see the usage for an explanation.\n\nUsage: ") + local.usage);
  }
  async.series([

    function (callback) {
      if (!fs.existsSync(fhcLocalDir)) {
        log.info(i18n._("Please wait while the local directory is initialized"));
        initlocal.initlocal([argObj.appid], function (err) {
          if (!err) {
            log.info(i18n._("One time initialization complete.\nLaunching local services."));
          } else {
            log.error(util.format(i18n._("Unexpected error during initialization. Is the guid '%s' correct?"), argObj.appid));
          }
          return callback(err);
        });
      } else {
        return callback();
      }
    },
    function (callback) {
      initlocal.getEnvVars(appid, function (err, envVars) {
        if (err) {
          return callback(err);
        }
        appEnvironment = envVars;
        return callback();
      });
    },
    function (callback) {
      packages = getPackagesList(argObj.packages);

      log.silly(i18n._('Packages list: ') + JSON.stringify(packages), 'packages');

      if (argObj.startCloud) {
        console.log(util.format(i18n._('starting cloud code on port %s'), argObj.cloudPort));
        // parameters are passed to the app in the process environment
        if (argObj.fh3) {
          appEnvironment['NODE_PATH'] = argObj.cloudDir;
        } else {
          appEnvironment['NODE_PATH'] = (process.platform === 'win32') ? argObj.cloudDir + ';./shared' : argObj.cloudDir + ':./shared';
        }
        appEnvironment['FH_PORT'] = argObj.cloudPort;
        appEnvironment['FH_REDIS_HOST'] = argObj.redisHost;
        appEnvironment['FH_REDIS_PORT'] = argObj.redisPort;

        if (argObj.redisPassword) {
          appEnvironment['FH_REDIS_PASSWORD'] = argObj.redisPassword;
        }

        if (argObj.localDB) {
          appEnvironment['FH_USE_LOCAL_DB'] = "true";
        }

        if (!(fs.existsSync(argObj.cloudDir + '/application.js') && (fs.existsSync(argObj.cloudDir + '/package.json')))) {
          return callback(new Error(i18n._("running local requires application.js and package.json in your cloud code")));
        }

        npmInstall(argObj.cloudDir, undefined, function (err, code) {
          if (err || (code > 0)) {
            return callback(err);
          }
          var node_args = [];
          if (argObj.debugBrk) {
            node_args.push("--debug-brk");
            log.info(i18n._("Starting cloud code with debug enabled, you will need to connect a debugger"));
          } else if (argObj.debug) {
            node_args.push("--debug");
            log.info(i18n._("Starting cloud code with debug enabled, you may connect a debugger"));
          }
          node_args.push(argObj.cloudDir + '/application.js');
          execCmd('node', node_args, process.cwd(), appEnvironment, function (err, code) {
            log.error(i18n._('cloud application exitted.'));
            if (clientServer) {
              clientServer.close();
            }
            if (err) {
              log.error(err);
            } else {
              log.error(i18n._('exit code: '), code);
            }
          });
        });
      }

      var clientServer = http.createServer(function (request, response) {
        handleClientRequest(request, response, argObj);
      });

      try {
        clientServer.listen(argObj.clientPort);
      }
      catch (e) {
        return callback(e);
      }
      log.info(i18n._("Serving App files on port: ") + argObj.clientPort);
      log.info(util.format(i18n._("go to %s:%s/ in your browser"), argObj.clientHost, argObj.clientPort));
      if (argObj.openClient) {
        open(argObj.clientHost + ":" + argObj.clientPort);
      }
    }
  ], function (err) {
    return cb(err);
  });
}

function getMimeType(fileName) {
  var retVal = mime.lookup(fileName) || "text/plain";
  log.silly(util.format(i18n._('mimetype for %s is %s'), fileName, retVal));
  return retVal;
}

function startsWith(str, query) {
  return str.indexOf(query) === 0;
}

// construct list of possible filenames based on package order
// include paths with the default filename attached (i.e. index.html)
function producePossiblePathNames(clientDir, sharedDir, packages, uri, defaultFileName) {
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

function resolveFileName(uri, options, cb) {
  var defaultFile = 'index.html';
  async.waterfall([

    function (callback) {
      var result;
      if (uri.indexOf("/box") >= 0) {
        log.silly(i18n._("Received app init mesasge."));
        result = path.join('./.fhclocal/', 'initResponse.json');
      }
      return callback(undefined, result);
    },
    function (input, callback) {
      var result = input;
      // if already found, don't need to try this
      if (!result && startsWith(uri, "/.fhclocal/")) {
        result = path.join(".", uri);
        log.silly(i18n._('Container file requested: '));
      }
      return callback(undefined, result);
    },
    function (input, callback) {
      var result = input;
      // if already found, don't need to try this
      if (result) {
        return callback(undefined, result);
      }

      if (options.fh3) {
        // For feedhenry 3 apps, use the clientDir from option, no muss, no fuss, just serve the file
        result = path.join(options.clientDir, uri);
        fs.stat(result, function (err, stats) {
          if (!err && stats && stats.isFile()) {
            log.silly(i18n._('FH3 file requested '), result);
            return callback(undefined, result);
          }
          else {
            // Try returning index.html
            result = path.join(options.clientDir, uri, defaultFile);
            log.silly(i18n._('FH3 file requested '), result);
            return callback(undefined, result);
          }
        });

      }
      else {
        var possiblePathNames = producePossiblePathNames(options.clientDir, sharedDir, packages, uri, defaultFile);
        async.detectSeries(possiblePathNames, function (file, callback) {
          fs.stat(file, function (err, stats) {
            return callback(!err && stats && stats.isFile());
          });
        }, function (resultFile) {
          log.verbose(i18n._('App client file requested: ') + resultFile);
          return callback(undefined, resultFile);
        });
      }
    }
  ], cb);
}

// bash completion
local.completion = function (opts, cb) {
  common.getAppIds(cb);
};
