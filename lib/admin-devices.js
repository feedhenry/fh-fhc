
module.exports = devices;
devices.list = list;

devices.usage = "\nfhc devices list"
             +"\nfhc devices create <device-id> <description> <make> <model>"
             +"\nfhc devices delete <device-id>"
             +"\nfhc devices read <device-id>"
             +"\nfhc devices update <device-id> <description> <make> <model> <enabled> <blocked>"
             +"\nfhc devices addusers <device-id> <user-email>*"
             +"\nfhc devices removeusers <device-id> <user-email>*"
             +"\nfhc devices approvals <device-id>"

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main devices entry point
function devices (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'list') {
    return list(cb);
  }else if (action === 'create'){
    if (args.length !== 5) return cb("Invalid arguments for 'create':" + devices.usage);
    return create(args[1], args[2], args[3], args[4], cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + devices.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 7) return cb("Invalid arguments for 'update':" + devices.usage);
    return update(args[1], args[2], args[3], args[4], args[5], args[6], cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + devices.usage);
    return deleteDevice(args[1], cb);
  }else if (action === 'addusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'addusers':" + devices.usage);
    var act = args.shift();
    var id = args.shift();
    return addusers(id, args, cb);
  }else if (action === 'removeusers'){
    if (args.length <= 2) return cb("Invalid arguments for 'removeusers':" + devices.usage);
    var act = args.shift();
    var id = args.shift();
    return removeusers(id, args, cb);
  }else if (action === 'approvals'){
    if (args.length !== 1) return cb("Invalid arguments for 'approvals':" + devices.usage);
    return approvals(cb);
  }else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb(devices.usage);
  }
}

// list devices
function list(cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/list", {}, "Error listing devices: ", function(err, devices){
    if(err) return cb(err);
    return cb(undefined, devices);
  });
}

// create device
function create(id, desc, make, model, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/create", {"payload":{"device":id, "deviceDesc": desc, "make": make, "model": model}}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete device
function deleteDevice(id, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/delete", {"payload":{"device": id}}, "Error deleting device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update user
function update(id, desc, make, model, enabled, blocked, cb) {  
  if (typeof enabled === 'string') {
    enabled = (enabled === 'true');
  }

  if (typeof blocked === 'string') {
    blocked = (blocked === 'true');
  }

  var payload = {
    "device": id,
    "deviceDesc": desc,
    "make": make,
    "model": model,
    "enabled": enabled,
    "blocked": blocked
  };

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/update", {"payload": payload}, "Error updating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read user
function read(id, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/read", {"payload":{"device": id}}, "Error reading device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add users to a device
function addusers(id, users, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/addusers", {"payload":{"device": id, "owner": users}}, "Error adding users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users from a group
function removeusers(id, users, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/removeusers", {"payload":{"device": id, "owner": users}}, "Error removing users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// list approvals
function approvals(cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/arm/device/listApprovals", {}, "Error listing device approvals: ", function(err, approvals){
    if(err) return cb(err);
    return cb(undefined, approvals);
  });
}

// bash completion
devices.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "devices") argv.unshift("devices");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "addusers", "removeusers", "approvals"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }

/*
  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get devices list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
