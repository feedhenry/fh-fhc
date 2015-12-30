module.exports = auth;
auth.doAuth = doAuth;

auth.desc = "Performs an auth call against an Auth Policy";
auth.usage = "\nfhc auth <policy-id> <client-token> <device> <params>"
  + "\n    where <policy-id> is an Auth Policy Id"
  + "\n    where <client-token> is typically an App Id"
  + "\n    where <device> is an identifier for the device"
  + "\n    where <params> are the auth parameters specific to the auth policy";

var log = require("../../utils/log");
var fhreq = require("../../utils/request");
var common = require("../../common");

// Main auth entry point
function auth(argv, cb) {
  var args = argv._;
  if (args.length !== 4) {
    return cb("Invalid arguments:" + auth.usage);
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
  }, "Error in auth call: ", function (err, auth) {
    if (err) return cb(err);
    return cb(undefined, auth);
  });
}

// bash completion
auth.completion = function (opts) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "auth") argv.unshift("auth");
};
