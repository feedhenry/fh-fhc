/* globals i18n */
module.exports = auth;
auth.doAuth = doAuth;

auth.desc = i18n._("Performs an auth call against an Auth Policy");
auth.usage = "\nfhc auth <policy-id> <client-token> <device> <params>"
  + i18n._("\n    where <policy-id> is an Auth Policy Id")
  + i18n._("\n    where <client-token> is typically an App Id")
  + i18n._("\n    where <device> is an identifier for the device")
  + i18n._("\n    where <params> are the auth parameters specific to the auth policy");

var log = require("../../utils/log");
var fhreq = require("../../utils/request");
var common = require("../../common");

// Main auth entry point
function auth(argv, cb) {
  var args = argv._;
  if (args.length !== 4) {
    return cb(i18n._("Invalid arguments:") + auth.usage);
  }

  return doAuth(args[0], args[1], args[2], args[3], cb);
}

// do our auth
function doAuth(policyId, clientToken, device, params, cb) {
  if (typeof params === 'string') {
    params = JSON.parse(params);
  }
  var cmd = JSON.stringify(params);
  cmd = '"' + cmd.replace(/"/g, '\\"') + '"';
  log.silly("fhc auth " + policyId + " " + clientToken + " " + device + " " + cmd, "auth:");
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/auth", {
    policyId: policyId,
    clientToken: clientToken,
    device: device,
    params: params
  }, i18n._("Error in auth call: "), function (err, auth) {
    if (err) return cb(err);
    return cb(undefined, auth);
  });
}

// bash completion
auth.completion = function (opts) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "auth") argv.unshift("auth");
};
