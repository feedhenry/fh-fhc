
module.exports = users;
users.list = list;
users.create = create;

users.usage = "\nfhc users list"
             +"\nfhc users create <email> <name> <password>"
             +"\nfhc users delete <email>"
             +"\nfhc users read <email>"
             +"\nfhc users update <email> <name> <enabled> (true||false)"
             +"\nfhc users addapps <email> <app-id>*"
             +"\nfhc users removeapps <email> <app-id>*"
             +"\nfhc users adddevices <email> <device-id>*"
             +"\nfhc users removeapps <email> <device-id>*"
             +"\nfhc users addgroup <email> <group-id>*"
             +"\nfhc users removegroup <email> <group-id>*"

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main users entry point
function users (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'list') {
    return list(cb);
  }else if (action === 'create'){
    if (args.length !== 4) return cb("Invalid arguments for 'create':" + users.usage);
    return create(args[1], args[2], args[3], cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + users.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 4) return cb("Invalid arguments for 'update':" + users.usage);
    return update(args[1], args[2], args[3], cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + users.usage);
    return deleteUser(args[1], cb);
  }else if (action === 'addapps'){
    if (args.length <= 2) return cb("Invalid arguments for 'addapps':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return addusers(id, args, cb);
  }else if (action === 'removeapps'){
    if (args.length <= 2) return cb("Invalid arguments for 'removeapps':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return removeapps(id, args, cb);
  }else if (action === 'adddevices'){
    if (args.length <= 2) return cb("Invalid arguments for 'adddevices':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return adddevices(id, args, cb);
  }else if (action === 'removedevices'){
    if (args.length <= 2) return cb("Invalid arguments for 'removedevices':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return removedevices(id, args, cb);
  }else if (action === 'addgroups'){
    if (args.length <= 2) return cb("Invalid arguments for 'addgroup':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return adddevices(id, args, cb);
  }else if (action === 'removegroups'){
    if (args.length <= 2) return cb("Invalid arguments for 'removegroups':" + users.usage);
    var act = args.shift();
    var id = args.shift();
    return removedevices(id, args, cb);
  }else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb(users.usage);
  }
}

// list users
function list(cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/list", {}, "Error listing users: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(email, name, password, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/create", {"payload":{"userId": email, "password": password, "name": name}}, "Error creating user: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete user
function deleteUser(email, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/delete", {"payload":{"userId": email}}, "Error deleting user: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update user
function update(email, name, enabled, cb) {  
  if (typeof enabled === 'string') {
    enabled = (enabled === 'true');
  }
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/update", {"payload":{"userId": email, "enabled": enabled, "name": name}}, "Error updating user: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read user
function read(email, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/read", {"payload":{"userId": email}}, "Error reading user: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add apps to a user
function addapps(email, apps, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/addapps", {"payload":{"userId": email, "apps": apps}}, "Error adding apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove apps from a user
function removeapps(email, apps, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/removeapps", {"payload":{"userId": id, "apps": apps}}, "Error removing apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add devices to a user
function adddevices(email, devices, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/adddevices", {"payload":{"userId": email, "devices": devices}}, "Error adding devices: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove devices from a user
function removedevices(email, devices, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/removedevices", {"payload":{"userId": id, "devices": apps}}, "Error removing devices: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add groups to a user
function addgroups(email, groups, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/user/addgroups", {"payload":{"userId": email, "groups": groups}}, "Error adding group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove groups from a user
function removegroups(email, groups, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/group/removegroups", {"payload":{"userId": id, "groups": groups}}, "Error removing groups: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
users.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "users") argv.unshift("users");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "addapps", "removeapps", "adddevices", "removedevices", "addgroups", "removegroups"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }

/*
  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get users list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
