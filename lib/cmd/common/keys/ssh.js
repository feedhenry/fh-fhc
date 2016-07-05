/* globals i18n */
module.exports = sshkeys;

sshkeys.desc = i18n._("Manage User SSH Keys");
sshkeys.usage = "fhc keys ssh [list]"
    + "\nfhc keys ssh add <label> <key-file>"
    + "\nfhc keys ssh delete <label>";

var common = require("../../../common");
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var ini = require('../../../utils/ini');
var _ = require('underscore');
var user = require('../user.js');
var fs = require('fs');
var util = require('util');

function unknown(message, cb) {
  return cb(message + "\n" + i18n._("Usage: ") + "\n" + sshkeys.usage);
}

function sshkeys(argv, cb) {
  var args = argv._;
  if (args.length === 0) return listKeys(cb);

  var action = args[0];
  if ("list" === action) {
    return listKeys(cb);
  } else if ("add" === action) {
    return addKey(args, cb);
  } else if ("delete" === action) {
    return deleteKey(args, cb);
  } else {
    return unknown(util.format(i18n._("Invalid action %s"), action), cb);
  }
}

function listKeys(cb) {
  user({ _ : []}, function(err, u) {
    if (ini.get('table') === true) {
      // when showing a table of keys, chop the middle out of each key (and replace with '...') for readability
      var values = _.map(u.keys, function(k) {
        return { name: k.name, key: k.key.replace(/(^.{25})(.*?)(.{20}$)/g, "$1.....$3")};
      });
      var headers = ['Name', 'Key'];
      var fields = ['name', 'key'];
      sshkeys.table = common.createTableFromArray(headers, fields, values);
    }

    return cb(err, u.keys);
  });
}

function deleteKey(args, cb) {
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var label = args[1];
  var url = "box/srv/1.1/ide/" + fhc.curTarget + "/user/removeKey";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {name: label},  i18n._("Error deleting key: "), cb);
}

function addKey(args, cb) {
  if (args.length < 2) {
    return unknown(i18n._("Invalid arguments"), cb);
  }

  var label = args[1];
  var keyFile = args[2];
  if (!fs.existsSync(keyFile)) {
    return cb(i18n._("File doesn't exist: ") + keyFile);
  }

  fs.readFile(keyFile, function(err, key) {
    if (err) return cb(err);

    var url = "box/srv/1.1/ide/" + fhc.curTarget + "/user/addKey";
    var payload = {
      label: label,
      key: key.toString()
    };
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error adding Key: "), cb);
  });
}

// bash completion
sshkeys.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "ssh") argv.unshift("ssh");
  if (argv.length === 2) {
    return cb(null, ["add", "delete", "list"]);
  }

  function listKeyNames(cb) {
    listKeys(function(err, keys) {
      if (err) return cb(null, []);
      return cb(null, _.pluck(keys, 'name'));
    });
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "delete":
        listKeyNames(cb);
        break;
      default:
        return cb(null, []);
    }
  }
};
