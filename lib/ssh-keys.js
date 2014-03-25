module.exports = sshkeys;

sshkeys.usage = "fhc sshkeys [list]"
    + "\nfhc sshkeys add <label> <key-file>"
    + "\nfhc sshkeys delete <label>";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');
var _ = require('underscore');
var util = require('util');
var user = require('./user.js');
var Table = require('cli-table');
var fs = require('fs');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + sshkeys.usage);
};

function sshkeys(args, cb) {
  if (args.length === 0) return listKeys(cb);

  var action = args[0];
  if ("list" === action) {
    return listKeys(cb);
  } else if ("add" === action) {
    return addKey(args, cb);
  } else if ("delete" === action) {
    return deleteKey(args, cb);
  } else {
    return unknown("Invalid action " + action, cb);
  }
};

function listKeys(cb) {
  user([], function(err, u) {
    if (ini.get('table') === true) {
      // when showing a table of keys, chop the middle out of each key (and replace with '...') for readability
      var values = _.map(u.keys, function(k) {
        return { name: k.name, key: k.key.replace(/(sh-rsa .{15})(.*?)(.{15}==..*)/g, "$1...$3")};
      });
      var headers = ['Name', 'Key'];
      var fields = ['name', 'key'];
      sshkeys.table = common.createTableFromArray(headers, fields, values);
    }

    return cb(err, u.keys);
  });
};

function deleteKey(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var label = args[1];
  var url = "box/srv/1.1/ide/testing/user/removeKey";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {name: label},  "Error deleting key: ", cb);
};

function addKey(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var label = args[1];
  var keyFile = args[2];
  if (!fs.existsSync(keyFile)) {
    return cb("File doesn't exist: " + keyFile);
  }

  fs.readFile(keyFile, function(err, key) {
    if (err) return cb(err);

    var url = "box/srv/1.1/ide/testing/user/addKey";
    var payload = {
      label: label,
      key: key.toString()
    };
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  "Error adding Key: ", cb);
  });
};

// bash completion
sshkeys.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "ssh-keys") argv.unshift("ssh-keys");
  if (argv.length === 2) {
    return cb(null, ["add", "delete", "list"]);
  }

  function listKeyNames(cb) {
    listKeys(function(err, keys) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(keys, 'name'));
    });
  };

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "delete":
        listKeyNames(cb);
        break;
      default: return cb(null, []);
    }
  }
};
