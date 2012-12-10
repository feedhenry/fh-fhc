
module.exports = secureendpoints;
secureendpoints.usage = 
               "\nfhc secureendpoints [get] <app-id> [--live]"
              +"\nfhc secureendpoints set-default <app-id> <default> [--live]"
              +"\nfhc secureendpoints set-override <app-id> <endpoint> <security> [--live]"
              +"\nfhc secureendpoints remove-override <app-id> <endpoint> [--live]"
              +"\nfhc secureendpoints auditlog <app-id> [--live]"
              +"\nwhere 'default' can be either 'https' or 'appapikey'"
              +"\nUse 'fhc appendpoints' to list an Apps endpoints.";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main secureendpoints entry point
function secureendpoints (args, cb) {
  var target = ini.get('live') ? 'live' : 'dev';
  // horrible hack for using as a script, check if the last arg is trying to override target
  if (args[args.length -1] === 'live' || args[args.length -1] === 'dev') {
    target = args[args.length -1];
    args.pop();
  }

  if (args.length == 1){
    return getSecureEndpoints(args[0], target, cb);
  }

  var action = args[0];
  if (action == 'get') {
    return getSecureEndpoints(args[1], target, cb);
  }else if (action === 'set-default'){
    if (args.length !== 3) return cb("Invalid arguments for 'set-default':" + secureendpoints.usage);
    return setDefault(args[1], args[2], target, cb);
  }else if (action === 'set-override'){
    if (args.length !== 4) return cb("Invalid arguments for 'set-override':" + secureendpoints.usage);
    return setOverride(args[1], args[2], args[3], target, cb);
  }else if (action === 'remove-override'){
    if (args.length !== 3) return cb("Invalid arguments for 'remove-override':" + secureendpoints.usage);
    return removeOverride(args[1], args[2], target, cb);
  }else if (action === 'auditlog'){
    return auditLog(args[1], args[2], target, cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + secureendpoints.usage);
  }
};

// get secureendpoints
function getSecureEndpoints(appId, env, cb) {
  var payload = {appId: appId, environment: env};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/get", payload, "Error getting secureendpoints: ", function(err, secureendpoints){
    if(err) return cb(err);
    return cb(undefined, secureendpoints);
  });
};

// set default secureendpoints
function setDefault(appId, def, env, cb) {
  if (def !== 'https' && def !== 'appapikey') return cb("'default' must be 'https' or 'appapikey': " + secureendpoints.usage);
  var payload = {appId: appId, environment: env};
  payload['default'] = def;
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setDefault", payload, "Error setting default secureendpoint: ", function(err, resp){
    if(err) return cb(err);
    return cb(undefined, resp);
  });
};

// set override
function setOverride(appId, endpoint, security, env, cb) {
  if (security !== 'https' && security !== 'appapikey') return cb("'security' must be 'https' or 'appapikey': " + secureendpoints.usage);
  var payload = {appId: appId, environment: env};
  payload.overrides = {};
  payload.overrides[endpoint] = {
    security: security
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setOverride", payload, "Error overriding secureendpoint: ", function(err, resp){
    if(err) return cb(err);
    return cb(undefined, resp);
  });
};

// remove override
function removeOverride(appId, endpoint, env, cb) {
  var payload = {appId: appId, environment: env, endpoint: endpoint};
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/removeOverride", payload, "Error removing override: ", function(err, resp){
    if(err) return cb(err);
    return cb(undefined, resp);
  });
};

// get audit log for this apps secure endpoints
function auditLog(appId, filter, env, cb) {
  var payload = {appId: appId, environment: env};
  if (filter) payload.filter = filter;
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/auditLog", payload, "Error getting auditlog: ", function(err, log){
    if(err) return cb(err);
    return cb(undefined, log);
  });
};

// bash completion
secureendpoints.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "secureendpoints") argv.unshift("secureendpoints");
  if (argv.length === 2) {
    var cmds = ["get", "set-default", "set-override", "remove-override", "auditlog"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }

  common.getAppIds(cb);
};
