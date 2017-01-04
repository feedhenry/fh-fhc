/* globals i18n */
module.exports = status;

status.desc = i18n._("Manage status");
status.usage = "fhc admin status \n fhc admin status <component> \n";
status.perm = "cluster:read";

var fhreq = require("../../../utils/request");

function status(argv, cb) {
  var args = argv._;
  if (args.length < 1) {
    return unknown(i18n._("Invalid arguments"), cb);
  }
  if (args.length === 1) {
    switch (args[0].toLocaleLowerCase()) {
      case "millicore":
        return millicoreStatus(cb);
      default:
        return unknown(i18n._("Invalid component"), cb);
    }
  }
}

function millicoreStatus(cb) {
  fhreq.GET(fhreq.getFeedHenryUrl(), "/box/api/status", i18n._("error getting status"), function (err, ok) {
    cb(err, ok);
  });
}

function unknown(message, cb) {
  return cb(message + "\n" + i18n._("Usage: \n") + status.usage);
}
