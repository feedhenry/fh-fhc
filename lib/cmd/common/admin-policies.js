
module.exports = policies;
policies.list = list;
policies.create = create;
policies.deletePolicy = deletePolicy;
policies.update = update;
policies.read = read;
policies.users = listUsers;
policies.addusers = addUsers;
policies.removeusers = removeUsers;

policies.usage = "\nfhc policies list"
              +"\nfhc policies create <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]"
              +"\nfhc policies update <guid> <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]"
              +"\n    where <policy-type> is one of: OAUTH1 | OAUTH2 | LDAP | OPENID | FEEDHENRY"
              +'\n    where <config> is a json object corresponding to the policy type, e.g.'
              +'\n          for OAuth2: "{"clientId": "1234567890.apps.example.com",  "clientSecret": "Wfv8DQw80hhyaBqnW37x5R23", "provider": "GOOGLE"}"'
              +'\n          for LDAP: "{"authmethod": "simple", "url": "ldap://foo.example.com:389, "dn": "ou=people,dc=example,dc=com", "dn_prefix": "cn", "provider": "LDAP"}'
              +'\n                       authmethod can be one of: "simple", "DIGEST-MD5", "CRAM-MD5", or "GSSAPI"'
              +"\n    where <check-user-exists> is one of: true | false. The default here is 'false'."
              +"\n    where <check-user-approved> is one of: true | false. The default here is 'false'."
              +"\nfhc policies delete <guid>"
              +"\nfhc policies read <policy-id>"
              +"\nfhc policies users <policy-id>"
              +"\nfhc policies addusers <policy-guid> <user-id>*"
              +"\nfhc policies removeusers <policy-guid> <user-id>*";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main policies entry point
function policies (argv, cb) {
  var args = argv._;
  if (args.length === 0){
    return list(cb);
  }

  var action = args[0];
  if (action === 'list') {
    return list(cb);
  }else if (action === 'create'){
    if (args.length < 4) return cb("Invalid arguments for 'create':" + policies.usage);
    return create(args[1], args[2], args[3], args[4], args[5], cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + policies.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 6) return cb("Invalid arguments for 'update':" + policies.usage);
    return update(args[1], args[2], args[3], args[4], args[5], cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + policies.usage);
    return deletePolicy(args[1], cb);
  }else if (action === 'users' || action === 'listusers'){
    if (args.length !== 2) return cb("Invalid arguments for 'users':" + policies.usage);
    return listUsers(args[1], cb);
  }else if (action === 'addusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'addusers':" + policies.usage);
    var act = args.shift();
    var policyGuid = args.shift();
    return addUsers(policyGuid, args, cb);
  }else if (action === 'removeusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'removeuser':" + policies.usage);
    return removeUsers(args[1], cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + policies.usage);
  }
}

// list policies
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/list", {}, "Error listing policies: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(id, type, config, checkUserExists, checkUserApproved, cb) {
  if (type !== 'OAUTH1' && type !== 'OAUTH2' && type !== 'LDAP' && type !== 'OPENID' && type !== 'FEEDHENRY'){
    return cb("'<policy-type>' must be one of: OAUTH1 | OAUTH2 | LDAP | OPENID | FEEDHENRY");
  }

  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (x) {
      return cb("Error parsing 'configurations' paramater: " + util.inspect(x));
    }
  }

  var payload = {
    "policyId": id,
    "policyType": type,
    "configurations": config,
    "checkUserExists" : checkUserExists || false,
    "checkUserApproved" : checkUserApproved || false
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/create", payload, "Error creating policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete policy
function deletePolicy(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/delete", {"guid": id}, "Error deleting policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read policy
function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/read", {"policyId": id}, "Error reading policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update policy
function update(guid, policyId, type, config, checkUserExists, checkUserApproved, cb) {
  if (type !== 'OAUTH1' && type !== 'OAUTH2' && type !== 'LDAP' && type !== 'OPENID' && type !== 'FEEDHENRY'){
    return cb("'<policy-type>' must be one of: OAUTH1 | OAUTH2 | LDAP | OPENID | FEEDHENRY");
  }

  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (x) {
      return cb("Error parsing 'configurations' paramater: " + util.inspect(x));
    }
  }

  var payload = {
    "guid" : guid,
    "policyId": policyId,
    "policyType": type,
    "configurations": config,
    "checkUserExists" : checkUserExists || false,
    "checkUserApproved" : checkUserApproved || false
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/update", payload, "Error updating policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// list users
function listUsers(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/users", {guid: guid}, "Error listing users policies: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// add users
function addUsers(guid, users, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/addusers", {guid: guid, users: users}, "Error adding users to policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users
function removeUsers(guid, users, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/removeusers", {guid: guid, users: users}, "Error removing users from policy: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
policies.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "policies") argv.unshift("policies");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "users", "addusers", "removeusers"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
// TODO - list policies for certain actions..
/*
  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get policies list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
