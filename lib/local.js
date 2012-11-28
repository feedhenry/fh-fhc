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
  console.log('calling spawn(cmd: ' + cmd + ', args: ' + JSON.stringify(args) + ', spawn_options: ' + JSON.stringify(spawn_options));

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
    'FH_PORT': argObj.port,
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

}

