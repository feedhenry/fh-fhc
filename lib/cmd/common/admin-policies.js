/* globals i18n */

module.exports = policies;
policies.list = list;
policies.create = create;
policies.deletePolicy = deletePolicy;
policies.update = update;
policies.read = read;
policies.users = listUsers;
policies.addusers = addUsers;
policies.removeusers = removeUsers;

policies.desc = i18n._("Operations on Auth Policies for connecting to 3rd party auth systems");
policies.usage = "\nfhc policies list"
              +"\nfhc policies create <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]"
              +"\nfhc policies update <guid> <policy-id> <policy-type> <config> [<check-user-exists>] [<check-user-approved>]"
              +i18n._("\n    where <policy-type> is one of: OAUTH1 | OAUTH2 | LDAP | OPENID | FEEDHENRY")
              +i18n._('\n    where <config> is a json object corresponding to the policy type, e.g.')
              +i18n._('\n          for OAuth2: "{"clientId": "1234567890.apps.example.com",  "clientSecret": "Wfv8DQw80hhyaBqnW37x5R23", "provider": "GOOGLE"}"')
              +i18n._('\n          for LDAP: "{"authmethod": "simple", "url": "ldap://foo.example.com:389, "dn": "ou=people,dc=example,dc=com", "dn_prefix": "cn", "provider": "LDAP"}')
              +i18n._('\n                       authmethod can be one of: "simple", "DIGEST-MD5", "CRAM-MD5", or "GSSAPI"')
              +i18n._("\n    where <check-user-exists> is one of: true | false. The default here is 'false'.")
              +i18n._("\n    where <check-user-approved> is one of: true | false. The default here is 'false'.")
              +"\nfhc policies delete <guid>"
              +"\nfhc policies read <policy-id>"
              +"\nfhc policies users <policy-id>"
              +"\nfhc policies addusers <policy-guid> <user-id>*"
              +"\nfhc policies removeusers <policy-guid> <user-id>*";

var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var _ = require('underscore');

var validPolicies = [
  'OAUTH1',
  'OAUTH2',
  'LDAP',
  'OPENID',
  'FEEDHENRY'
];

function errorMessageString(action) {
  return util.format(i18n._("Invalid arguments for '%s':"), action);
}

// Main policies entry point
function policies (argv, cb) {
  /*eslint no-else-return:0 */
  var args = argv._;
  if (args.length === 0){
    return list(cb);
  }

  var action = args[0];
  if (action === 'list') {
    return list(cb);
  } else if (action === 'create'){
    if (args.length < 4) return cb(errorMessageString(action) + policies.usage);
    return create(args[1], args[2], args[3], args[4], args[5], cb);
  } else if (action === 'read'){
    if (args.length !== 2) return cb(errorMessageString(action) + policies.usage);
    return read(args[1], cb);
  } else if (action === 'update'){
    if (args.length !== 6) return cb(errorMessageString(action) + policies.usage);
    return update(args[1], args[2], args[3], args[4], args[5], cb);
  } else if (action === 'delete'){
    if (args.length !== 2) return cb(errorMessageString(action) + policies.usage);
    return deletePolicy(args[1], cb);
  } else if (action === 'users' || action === 'listusers'){
    if (args.length !== 2) return cb(errorMessageString(action) + policies.usage);
    return listUsers(args[1], cb);
  } else if (action === 'addusers'){
    if (args.length <= 2) return cb(errorMessageString(action) + policies.usage);
    args.shift(); // remove action
    var policyGuid = args.shift();
    return addUsers(policyGuid, args, cb);
  } else if (action === 'removeusers'){
    if (args.length <= 2) return cb(errorMessageString(action) + policies.usage);
    return removeUsers(args[1], cb);
  } else{
    return cb(util.format(i18n._("Unknown command '%s'."), action) + " " + i18n._("Usage: ") + policies.usage);
  }
}
/**
 * @param  {string} type Policy Type
 * @return {boolean}
 */
function validPolicyType(type) {
  return _.contains(validPolicies, type);
}

/**
 * @return {string} Error message
 */
function getPolicyTypeErrorMessage() {
  return util.format(i18n._("'<policy-type>' must be one of %s"), validPolicies.join(', '));
}

// list policies
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/list", {}, i18n._("Error listing policies: "), function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(id, type, config, checkUserExists, checkUserApproved, cb) {
  if (!validPolicyType(type)) {
    return cb(getPolicyTypeErrorMessage());
  }

  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (x) {
      return cb(i18n._("Error parsing 'configurations' paramater: ") + util.inspect(x));
    }
  }

  var payload = {
    "policyId": id,
    "policyType": type,
    "configurations": config,
    "checkUserExists" : checkUserExists || false,
    "checkUserApproved" : checkUserApproved || false
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/create", payload, i18n._("Error creating policy: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete policy
function deletePolicy(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/delete", {"guid": id}, i18n._("Error deleting policy: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read policy
function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/read", {"policyId": id}, i18n._("Error reading policy: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update policy
function update(guid, policyId, type, config, checkUserExists, checkUserApproved, cb) {
  if (!validPolicyType(type)) {
    return cb(getPolicyTypeErrorMessage());
  }

  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (x) {
      return cb(i18n._("Error parsing 'configurations' paramater: ") + util.inspect(x));
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

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/update", payload, i18n._("Error updating policy: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// list users
function listUsers(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/users", {guid: guid}, i18n._("Error listing users policies: "), function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// add users
function addUsers(guid, users, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/addusers", {guid: guid, users: users}, i18n._("Error adding users to policy: "), function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users
function removeUsers(guid, users, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/removeusers", {guid: guid, users: users}, i18n._("Error removing users from policy: "), function(err, data){
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
