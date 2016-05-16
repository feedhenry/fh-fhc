/* globals i18n */

module.exports = config;

config.desc = i18n._("Manage the fhc Configuration File");
config.usage =   "fhc fhcfg set <key> <value>"
             + "\nfhc fhcfg get <key>"
             + "\nfhc fhcfg delete <key>"
             + "\nfhc fhcfg list"
             + "\nfhc fhcfg edit";

var ini = require("../../utils/ini");
var log = require("../../utils/log");
var fhc = require("../../fhc");
var exec = require("../../utils/exec");
var fs = require("fs");
var dc;
var output = require("../../utils/output");
var types = require("../../utils/config-defs").types;

// fhc config set key value
// fhc config get key
// fhc config list
function config (argv, cb) {
  var args = argv._;
  var action = args.shift();
  switch (action) {
    case "set":
      return set(args[0], args[1], cb);
    case "get":
      return get(args[0], cb);

    case "delete":
    case "rm":
    case "del":
      return del(args[0], cb);

    case "list":
    case "ls":
      return list(cb);
    case "edit":
      return edit(cb);
    default:
      return unknown(action, cb);
  }
}

function edit (cb) {
  var e = ini.get("editor")
    , f = ini.get(ini.get("global") ? "globalconfig" : "userconfig");
  if (!e) {
    return cb(new Error(i18n._("No EDITOR config or environ set.")));
  }
  ini.save(function (er) {
    if (er) {
      return cb(er);
    }
    fs.readFile(f, "utf8", function (er, data) {
      if (er) {
        data = "";
      }
      dc = dc || require("../../utils/config-defs").defaults;
      data = [ ";;;;"
             , "; fhc "+(ini.get("global") ? "globalconfig" : "userconfig")+" file"
             , "; this is a simple ini-formatted file"
             , "; lines that start with semi-colons are comments, and removed."
             , "; read `fhc help config` for help on the various options"
             , ";;;;"
             , ""
             , data
             ].concat( [ ";;;;"
                       , "; all options with default values"
                       , ";;;;"
                       ])
              .concat(Object.keys(dc).map(function (k) {
                return "; " + k + " = " + ini.unParseField(dc[k],k);
              })).concat([""])
              .join("\n");

      fs.writeFile(f, data, "utf8", function (er) {
        if (er) {
          return cb(er);
        }
        exec("sh", ["-c", e + " "+f], function (er) {
          if (er) {
            return cb(er);
          }
          ini.resolveConfigs(function (er) {
            if (er) {
              return cb(er);
            }
            ini.save(cb);
          });
        });
      });
    });
  });
}

function del (key, cb) {
  if (!key) {
    return cb(new Error(i18n._("no key provided")));
  }
  ini.del(key);
  ini.save(cb);
}

function set (key, val, cb) {
  if (val === undefined) {
    if (key.indexOf("=") !== -1) {
      var k = key.split("=");
      key = k.shift();
      val = k.join("=");
    } else {
      val = "";
    }
  }
  key = key.trim();
  if (typeof val === 'string'){
    val = val.trim();
  }
  log("set "+key+" "+val, "config");
  var where = ini.get("global") ? "global" : "user";
  ini.set(key, val, where);
  ini.save(cb);
}

function get (key, cb) {
  if (!key) {
    return list(cb);
  }
  if (key.charAt(0) === "_") {
    return cb(new Error("---sekretz---"));
  }
  var val = fhc.config.get(key);
  output.write(val, function (err) {cb(err,val);});
}

function list (cb) {
  var msg = JSON.stringify(ini.store, null, 2);
  var long = fhc.config.get("long");
  msg += '\n';
  // only show defaults if --long
  if (!long) {
    msg += "; node install prefix = " + process.installPrefix + "\n"
         + "; node bin location = " + process.execPath + "\n"
         + "; cwd = " + process.cwd() + "\n"
         + "; HOME = " + process.env.HOME + "\n"
         + "; 'fhc config ls -l' to show all defaults.\n";
  }
  return output.write(msg, cb);
}

function unknown (action, cb) {
  cb("Usage:\n" + config.usage);
}

config.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "fhcconfig") {
    argv.unshift("fhcconfig");
  }
  if (argv.length === 2) {
    var cmds = ["get", "set", "delete", "ls", "rm", "edit"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(null, cmds);
  }
  var action = argv[2];
  switch (action) {
    case "set":
      if (argv.length > 3) {
        return cb(null, []);
      }
      return cb(null, Object.keys(types));
    case "get":
    case "delete":
    case "rm":
      return cb(null, Object.keys(types));
    case "edit":
    case "list":
    case "ls":
      return cb(null, []);
    default:
      return cb(null, []);
  }
};
