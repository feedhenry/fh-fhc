module.exports = credentials;

credentials.desc = "Operations on credential bundles";
credentials.usage = "fh credentials list"
    + "\nwhere <bundle-id> is a credentials bundle id";

var common = require("../../common");
var fhreq = require("../../utils/request");
var ini = require('../../utils/ini');

var API_URL = "box/api/credentials";

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + credentials.usage);
}

function credentials(argv, cb) {
  var args = argv._;
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
