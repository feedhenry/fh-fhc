/* globals i18n */
module.exports = credentials;

credentials.desc = i18n._("Operations on credential bundles");
credentials.usage = "fhc credentials list"
    + "\nwhere <bundle-id> is a credentials bundle id";

var common = require("../../common");
var fhreq = require("../../utils/request");
var ini = require('../../utils/ini');
var util = require('util');

var API_URL = "box/api/credentials";

function unknown(message, cb) {
  return cb(message + "\n" + i18n._("Usage: \n") + credentials.usage);
}

function credentials(argv, cb) {
  var args = argv._;
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  var action = args[0];
  if ("list" === action) {
    return listCredentials(args, cb);
  } else {
    return unknown(util.format(i18n._("Invalid credentials action %s"), action), cb);
  }
}

function listCredentials(args, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), API_URL, i18n._("Error reading credentials: "), function (err, data) {
    if (err) {
      return cb(err);
    }
    if (ini.get('table') === true) {
      credentials.table = common.createTableForCredentials(data);
    }
    return cb(err, data);
  });
}
