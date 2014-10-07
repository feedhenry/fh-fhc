// Create a chain of config objects, in this priority order:
//
// CLI - the --foo things in the command line.
// ENV - all the things starting with fhc_config_ in the environment
// USER - $HOME/.fhcrc
// GLOBAL - $PREFIX/etc/fhcrc
//
// If the CLI or ENV specify a userconfig, then that file is used
// as the USER config.
//
// If the CLI or ENV specify a globalconfig, then that file is used
// as the GLOBAL config.
//
// export fhc_config_userconfig=/some/other/file
// export fhc_config_globalconfig=global
//
// For implementation reasons, "_" in env vars is turned into "-". So,
// export fhc_config_auto_activate

exports.resolveConfigs = resolveConfigs;
exports.save = save;
exports.del = del;
exports.get = get;
exports.set = set;
exports.getEnvironment = getEnvironment;
exports.unParseField = unParseField;
exports.defaultConfig = null;

Object.defineProperty(exports, "keys",
  { get : function () { return configList.keys; }});

var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var sys = require("./sys");
var crypto = require("crypto");
var util = require("util");
var privateKey = null;
var chain = require("./chain");
var log = require("./log");
var ini = require("./ini-parser");
var ProtoList = require("./proto-list");
var defaultConfig;
var configList = new ProtoList();
var configDefs = require("./config-defs");
var types = configDefs.types;
var TRANS = exports.TRANS =
    { "default" : 4
    , "global" : 3
    , "user" : 2
    , "env" : 1
    , "cli" : 0
    };

exports.configList = configList;

// just put this here for a moment, so that the logs
// in the config-loading phase don't cause it to blow up.
configList.push({loglevel:"warn"});

function resolveConfigs (cli, cb_) {
  defaultConfig = defaultConfig || configDefs.defaults;
  exports.defaultConfig = defaultConfig;
  configList.pop();
  configList.push(defaultConfig);
  var cl = configList
    , dc = cl.pop();
  if (!cb_) cb_ = cli, cli = {};

  function cb (er) {
    //console.error("resolving configs: " + er)
    exports.resolved = true;
    cb_(er);
  };

  cl.list.length = 0;
  Object.keys(cli).forEach(function (k) {
    cli[k] = parseField(cli[k], k);
  });
  cl.push(cli);
  cl.push(parseEnv(process.env));
  parseFile(cl.get("userconfig") || dc.userconfig, function (er, conf) {
    if (er) return cb(er);
    cl.push(conf);
    parseFile( cl.get("globalconfig") || dc.globalconfig
             , function (er, conf) {
      if (er) return cb(er);
      cl.push(conf);
      cl.push(dc);
      setUser(cl, dc, cb);
    });
  });
};

function setUser (cl, dc, cb) {
  // If global, leave it as-is.
  // If not global, then set the user to the owner of the prefix folder.
  // Just set the default, so it can be overridden.
  //console.error("setUser "+cl.get("global")+" "+ cb.toString())
  if (cl.get("global")) return cb();
  if (process.env.SUDO_UID) {
    //console.error("uid="+process.env.SUDO_UID)
    dc.user = +(process.env.SUDO_UID);
    return cb();
  }
  //console.error("prefix="+cl.get("prefix"))
  fs.stat(path.resolve(cl.get("prefix")), function (er, st) {
    if (er) {
      return log.er(cb, "prefix directory not found")(er);
    }
    dc.user = st.uid;
    return cb();
  });
};

function parseEnv (env) {
  var conf = {};
  Object.keys(env)
    .filter(function (k) { return k.match(/^fhc_fhcfg_[^_]/i); })
    .forEach(function (k) {
      conf[k.replace(/^fhc_fhcfg_/i, "")
            .toLowerCase()
            .replace(/_/g, "-")] = parseField(env[k], k);
    });
  return conf;
};

function unParseField (f, k) {
  // type can be an array or single thing.
  var isPath = -1 !== [].concat(types[k]).indexOf(path);
  if (isPath) {
    if (typeof process.env.HOME !== 'undefined') {
      if (process.env.HOME.substr(-1) === "/") {
        process.env.HOME = process.env.HOME(0, process.env.HOME.length-1);
      }
      if (f.indexOf(process.env.HOME) === 0) {
        f = "~"+f.substr(process.env.HOME.length);
      }
    }
  }
  return f;
};

function parseField (f, k) {
  if (typeof f !== "string" && !(f instanceof String)) return f
  // type can be an array or single thing.
  var isPath = -1 !== [].concat(types[k]).indexOf(path);
  f = (""+f).trim();
  if (f === "") return f = true;
  switch (f) {
    case "true": return f = true;
    case "false": return f = false;
    case "null": return f = null;
    case "undefined": return f = undefined;
  }
  if (isPath) {
    if (f.substr(0, 2) === "~/" && process.env.HOME) {
      f = path.join(process.env.HOME, f.substr(2));
    }
    if (f.charAt(0) !== "/") {
      f = path.join(process.cwd(), f.substr(2));
    }
  }
  return f;
};

function parseFile (file, cb) {
  if (!file) return cb(null, {});
  log.silly(file, "config file");
  fs.readFile(file, function (er, data) {
    if (er) return cb(null, {});
    var d = ini.parse(""+data)["-"]
      , f = {};
    Object.keys(d).forEach(function (k) {
      f[k] = parseField(d[k], k);
    });
    return cb(null, f);
  });
};

function getKey (cb) {
  if (privateKey) return cb(null, privateKey);
  var ssh = path.join(process.env.HOME, ".ssh")
    , keys = [ path.join(ssh, "id_dsa")
             , path.join(ssh, "id_rsa")
             , path.join(ssh, "identity")
             ]
  ;(function K (k) {
    if (!k) return cb(null, false);
    fs.readFile(k, function (er, data) {
      if (er) return K(keys.shift());
      return cb(null, privateKey = data+"");
    });
  })(keys.shift());
};

function save (cb) {
  // If cfg is all in-memory (e.g. used from a script, etc) then we don't persist
  if (get('inmemoryconfig') === true) return cb();
  else return saveConfig("global", function (er) { saveConfig("user", cb); });
};

function saveConfig (which, cb) {
  if (which !== "global") which = "user";
  saveConfigfile
    ( configList.get(which + "config")
    , configList.list[TRANS[which]]
    , which === "user" ? 0600 : 0644
    , function (er) {
        if (er || which !== "user" || !process.getuid) return cb(er);
        var uid = process.env.SUDO_UID !== undefined
                ? process.env.SUDO_UID : process.getuid()
          , gid = process.env.SUDO_GID !== undefined
                ? process.env.SUDO_GID : process.getgid();
        fs.chown(configList.get(which + "config"), +uid, +gid, cb);
      });
};

function saveConfigfile (file, config, mode, cb) {
    var data = {};
    Object.keys(config).forEach(function (k) {
      data[k] = unParseField(config[k], k);
    });
    data = ini.stringify({"-":data}).trim();
    return (data) ? writeConfigfile(file, data+"\n", mode, cb)
                  : rmConfigfile(file, cb);
};

function writeConfigfile (configfile, data, mode, cb) {
  // only save config if property is set
  var persistTargets = configList.get('persistTargets');
  if ((('boolean' === typeof persistTargets) && persistTargets) || persistTargets === 'true') {
    fs.writeFile
      ( configfile, data, "utf8"
      , function (er) {
          if (er) log(er, "Failed saving "+configfile, cb);
          else if (mode) fs.chmod(configfile, mode, cb);
          else cb();
        }
      );
  } else {
    cb();
  }
}

function rmConfigfile (configfile, cb) {
  fs.stat(configfile, function (e) {
    if (e) return cb();
    fs.unlink(configfile, function (er) {
      if (er) log(er, "Couldn't remove "+configfile);
      cb();
    });
  });
};

function snapshot (which) {
  var x = (!which) ? configList.snapshot
        : configList.list[TRANS[which]] ? configList.list[TRANS[which]]
        : undefined;
  if (!x) return;
  Object.keys(x).forEach(function (k) { if (k.match(/^_/)) delete x[k]; });
  return x;
};

function get (key, which) {
  return (!key) ? snapshot(which)
       : (!which) ? configList.get(key) // resolved
       : configList.list[TRANS[which]] ? configList.list[TRANS[which]][key]
       : undefined;
};

function getEnvironment(args){
  var env = get('env');
  if (typeof args !== 'undefined' && typeof env === 'undefined'){
    for (var i=0; i<args.length; i++){
      var arg = args[i];
      // Current way of specifying arguments - this will provide for module require support, which env.get can't cater for
      if (arg.indexOf('--env=')>-1 && arg.split('=').length>1){
        env = arg.split('=')[1];
      }
      // Backwards compat & support fh-art
      if (arg === 'dev' || arg === 'live' || arg === 'development'){
        log.warn('Environment is now specified with the --env=<environment> flag');
        arg = (arg==='development') ? 'dev' : arg;
        // Pop off the arg, so it doesn't get confused for something else in a subsequent call
        args = args.splice(i, 1);
        env = arg;
      }
    }
  }
  // Apply defaults
  if (!env){
    log.error('Environment is mandetory - specify using --env=<environment>');
    throw new Error('Environment must be specified');
    
  }
  return env;
}

function del (key, which) {
  if (!which) configList.list.forEach(function (l) {
    delete l[key];
  });
  else if (configList.list[TRANS[which]]) {
    delete configList.list[TRANS[which]];
  }
};

function set (key, value, which) {
  which = which || "cli";
  if (configList.length === 1) {
    return new Error("trying to set before loading");
  }

  return configList.list[TRANS[which]][key] = value;
}
