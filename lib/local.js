"use strict";

module.exports = local;
local.usage = ["",
        "fhc local",
        ""].join("\n");


var http = require("http"),
  https = require("https"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  util = require("util"),
  events = require("events"),
  common = require("./common"),
  log = require("./utils/log"),
  fhc = require("./fhc"),
  hosts = require("./hosts"),
  spawn = require('child_process').spawn,
  mimeTypes = {
    json: "application/json",
    js: "text/javascript",
    css: "text/css",
    html: "text/html",
    xml: "text/xml",
    txt: "text/plain",
    woff: "font/opentype"
  };

fs.exists = fs.exists || path.exists;
fs.existsSync = fs.existsSync || path.existsSync;


var defaultArgs = {
    port: {
      required: true,
      val: 8000,
      type: "number"
    },
    cloudPort: {
      required: true,
      val: 8001,
      type: "number"
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

function exec_cmd(cmd, args, cwd, env, logfn, cb) {
  var logger = logfn || function () {};
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
  //console.log('calling spawn(cmd: ' + cmd + ', args: ' + JSON.stringify(args) + ', spawn_options: ' + JSON.stringify(spawn_options));

  var npm_install = spawn(cmd, args, spawn_options);

  npm_install.stdout.on('data', function (data) {
    logger('' + data);
  });

  npm_install.stderr.on('data', function (data) {
    logger('stderr: ' + data);
  });

  npm_install.on('exit', function (code) {
    logger('' + cmd + ': exited with code ' + code);
    if (cb) {
      return cb(undefined, code);
    }
  });
}

function npm_install(cwd, env, logfn, cb) {
  exec_cmd('npm', ['install'], cwd, env, logfn, cb);
}

function local(args, cb) {
  var argObj;
  try {
    argObj = common.parseArgs(args);
    validateArgs(argObj);
  } catch (x) {
    return cb("Error processing args: " + x + "\nUsage: " + local.usage);
  }

  // parameters are passed to the app in the process environment
  var appEnvironment = {
    'NODE_PATH': './cloud:./shared',
    'FH_PORT': argObj.cloudPort,
    'FH_REDIS_HOST': argObj.redisHost,
    'FH_REDIS_PORT': argObj.redisPort
  };
  if (argObj.redisPassword) {
    appEnvironment['FH_REDIS_PASSWORD'] = argObj.redisPassword;
  }

  if(!(fs.existsSync('./cloud/application.js') && (fs.existsSync('./cloud/package.json')))) {
    return cb(new Error("running local requires application.js and package.json in your cloud code"));
  }
  
  npm_install('./cloud', undefined, console.log, function (err, code) {
    if(err || (code > 0)) {
      return cb(err);
    }
    exec_cmd('node', ['./cloud/application.js'], process.cwd(), appEnvironment, console.log, function (err, code) {
      console.log('cloud application exitted.');
      if(err) {
        console.log("err: ", err);
      } else {
        console.log('exit code: ', code);
      }
    });
  });

  var clientServer = http.createServer(function(request, response) {
    handlClientRequest(request, response);
  });

  // clientServer.on("error", cb);
  // staticHandler.on("error", cb);
  // actHandler.on("error", cb);

  try {
    clientServer.listen(argObj.port);
  }
  catch(e) {
    return cb(e);
  }
  console.log("server listening on port:", argObj.port);
  console.log("go to http://127.0.0.1:" + argObj.port + "/ in your browser");
}

function getMimeType(fileName) {
  var retVal = mimeTypes.txt;
  var fileExtension = path.extname(fileName);
  if (fileExtension) {
    var len = fileExtension.length;
    if (len > 0) {
      if (fileExtension.substring(0,1) === '.') {
        fileExtension = fileExtension.substring(1, len);
      }
      retVal = mimeTypes[fileExtension] || mimeTypes.txt
    }
  }
  console.log('mimetype for ' + fileName + ' is ' + retVal + ', fileExtension was: ' + fileExtension);
  return retVal;
}

function startsWith(str, query) {
  return str.indexOf(query) === 0;
}

function resolveFileName (uri, cb) {
  var defaultFile = 'index.html';
  // generate filename
  // package list
  // package list.append("default");
  // iterate through package list
  //   check file in client/%packageIter%/filename
  //     or  file in shared/%packageIter%/filename
  //
  var fileName;
  if (uri.indexOf("/box") >= 0 ) {
    fileName = path.join('./.fhclocal/', 'initResponse.json');
    console.log("handling init: >\n" + fileName);
  } else if (startsWith(uri, "/.fhclocal/")) {
    fileName = path.join(".", uri);
    console.log('handling server - .fhclocal');
  } else {
    fileName = path.join("./client", "default", uri);
    console.log('normal file' + fileName);
  }
  fs.stat(fileName, function (err, stats) {
    if (!err && stats && stats.isDirectory()) {
      fileName = path.join(fileName, defaultFile);
    }
    fs.exists(fileName, function (fileExists) {
      console.log('file resolves: exists: ' + fileExists + ", name: " + fileName);
      return cb(fileExists, fileName);
    });
  });
}

var handlClientRequest = function(request, response) {
  var self = this,
    requestParams = url.parse(request.url, true),
    uri = requestParams.pathname;

  resolveFileName(uri, function (fileExists, fileName) {
    if (!fileExists) {
      console.log('file does not exist: ' + fileName);
      response.writeHead(404);
      return response.end("Not found\n");
    }
    response.setHeader("Content-Type", getMimeType(fileName));
    var fileStream;
    if (path.basename(fileName) === "index.html") {
      var container = fs.readFileSync(path.join(".fhclocal", "container.html"), "utf8");
      var appIndex = fs.readFileSync(fileName, 'utf8');
      container = container.replace("REPLACE_BODY_HERE", appIndex);
      console.log("special handling for index.html");
      response.end(container);
    } else {
      fileStream = fs.createReadStream(fileName);
      util.pump(fileStream, response);
    }
  });
};
