
module.exports = auth;
auth.doAuth = doAuth;

auth.usage = "\nfhc auth <policy-id> <client-token> <device> <params>"
            +"\n    where <policy-id> is an Auth Policy Id"
            +"\n    where <client-token> is typically an App Id"
            +"\n    where <device> is an identifier for the device"
            +"\n    where <params> are the auth parameters specific to the auth policy";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main auth entry point
function auth (argv, cb) {
  var args = argv._;
  if (args.length !== 4){
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
  cmd = '"' + cmd.replace(/"/g,'\\"') + '"';
  log.silly("fhc auth " + policyId + " " + clientToken + " " + device + " " + cmd, "auth:");
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/auth", {policyId: policyId, clientToken: clientToken, device: device, params: params}, "Error in auth call: ", function(err, auth){
    if(err) return cb(err);
    return cb(undefined, auth);
  });
}


// bash completion
auth.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "auth") argv.unshift("auth");
/*
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }

  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get auth list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
