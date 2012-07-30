
module.exports = auth;
auth.doAuth = doAuth;

auth.usage = "\nfhc auth <policy-id> <params>"
            +"\n    where <policy-id> is 'default' or an Auth Policy Id"
            +"\n    where <params> are the auth parameters specific to the auth policy";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main auth entry point
function auth (args, cb) {
  if (args.length !== 2){
    return cb("Invalid arguments:" + auth.usage);
  }

  return doAuth(args[0], args[1], cb);  
}

// do our auth
function doAuth(policyId, params, cb) {  
  if (typeof params === 'string') {
    params = JSON.parse(params);
  }
  //common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/auth", {type: policyId, params: params}, "Error in auth call: ", function(err, auth){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/auth", {policyId: policyId, params: params}, "Error in auth call: ", function(err, auth){
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
