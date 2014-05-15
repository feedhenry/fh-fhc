module.exports = credentials;

credentials.usage = "fhc credentials list"
    + "\nwhere <bundle-id> is a credentials bundle id";

var log = require("./utils/log");
var common = require("./common");
var fhreq = require("./utils/request");
var fhc = require("./fhc");
var ini = require('./utils/ini');

var API_URL = "box/srv/1.1/credentials";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + credentials.usage);
}

function credentials(args, cb) {
  if (args.length < 1) {
    return unknown("Invalid arguments", cb);
  }
  var action = args[0];
  if ("list" === action) {
    return listCredentials(args, cb);
  } /*else if ("create" === action) {
    return createCredentials(args, cb);
  } else if ("update" === action) {
    return updateCredentials(args, cb);
  } else if ("delete" === action) {
    return deleteCredentials(args, cb);
  }*/ else {
    return unknown("Invalid credentials action " + action, cb);
  }
}

function listCredentials(args, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), API_URL, "Error reading credentials: ", function (err, data) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      credentials.table = common.createTableForCredentials(data);
    }
    return cb(err, data);
  });
}