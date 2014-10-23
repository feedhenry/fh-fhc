
module.exports = groups;
groups.list = list;

groups.usage = "\nfhc groups list"
              +"\nfhc groups create <group-id> <group-name> <group-description>"
              +"\nfhc groups delete <group-id>"
              +"\nfhc groups read <group-id>"
              +"\nfhc groups update <group-id> <group-name> <group-description>"
              +"\nfhc groups addusers <group-id> <user-email>*"
              +"\nfhc groups removeusers <group-id> <user-email>*"
              +"\nfhc groups addapps <group-id> <app-id>*"
              +"\nfhc groups removeapps <group-id> <app-id>*";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main groups entry point
function groups (argv, cb) {
  var args = argv._;
  if (args.length === 0){
    return list(cb);
  }

  var action = args[0];
  if (action === 'list') {
    return list(cb);
  }else if (action === 'create'){
    if (args.length !== 4) return cb("Invalid arguments for 'create':" + groups.usage);
    return create(args[1], args[2], args[3], cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + groups.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 4) return cb("Invalid arguments for 'update':" + groups.usage);
    return update(args[1], args[2], args[3], cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + groups.usage);
    return deleteGroup(args[1], cb);
  }else if (action === 'addusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'addusers':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return addusers(id, args, cb);
  }else if (action === 'removeusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'removeusers':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return removeusers(id, args, cb);
  }else if (action === 'addapps'){
    if (args.length <= 2) return cb("Invalid arguments for 'addapps':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return addusers(id, args, cb);
  }else if (action === 'removeapps'){
    if (args.length <= 2) return cb("Invalid arguments for 'removeapps':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return removeapps(id, args, cb);
  }else if (args.length === 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + groups.usage);
  }
}

// list groups
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/list", {}, "Error listing groups: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(id, name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/create", {"payload":{"groupId": id, "groupName": name, "groupDesc": desc}}, "Error creating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete group
function deleteGroup(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/delete", {"payload":{"groupId": id}}, "Error deleting group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read group
function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/read", {"payload":{"groupId": id}}, "Error reading group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update group
function update(id, name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/update", {"payload":{"groupId": id, "groupDesc": desc, "groupName": name}}, "Error updating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add users to a group
function addusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/addusers", {"payload":{"groupId": id, "users": users}}, "Error adding users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users from a group
function removeusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/removeusers", {"payload":{"groupId": id, "users": users}}, "Error removing users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add apps to a group
function addapps(id, apps, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/addapps", {"payload":{"groupId": id, "apps": apps}}, "Error adding apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove apps from a group
function removeapps(id, apps, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/removeapps", {"payload":{"groupId": id, "apps": apps}}, "Error removing apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
groups.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "groups") argv.unshift("groups");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "addapps", "removeapps", "addusers", "removeusers"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
  var action = argv[2];
  switch (action) {
    case "addapps":
      common.getAppIds(cb);
      break;
    default: return cb(null, []);
  }

/*
  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get groups list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
