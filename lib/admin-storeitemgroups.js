
module.exports = groups;
groups.list = list;

groups.usage = "\nfhc storeitemgroups list"
              +"\nfhc storeitemgroups create <group-name> <group-description>"
              +"\nfhc storeitemgroups delete <group-guid>"
              +"\nfhc storeitemgroups read <group-guid>"
              +"\nfhc storeitemgroups update <group-guid> <group-name> <group-description>"
              +"\nfhc storeitemgroups addusers <group-guid> <user-email>*"
              +"\nfhc storeitemgroups removeusers <group-guid> <user-email>*"
              +"\nfhc storeitemgroups addstoreitems <group-guid> <storeitem-id>*"
              +"\nfhc storeitemgroups removestoreitems <group-guid> <storeitem-id>*"

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main groups entry point
function groups (args, cb) {
  if (args.length == 0){
    return list(cb);
  }

  var action = args[0];
  if (action == 'list') {
    return list(cb);
  }else if (action === 'create'){
    if (args.length !== 3) return cb("Invalid arguments for 'create':" + groups.usage);
    return create(args[1], args[2], cb);
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
  }else if (action === 'addstoreitems'){
    if (args.length <= 2) return cb("Invalid arguments for 'addstoreitems':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return addstoreitems(id, args, cb);
  }else if (action === 'removestoreitems'){
    if (args.length <= 2) return cb("Invalid arguments for 'removestoreitems':" + groups.usage);
    var act = args.shift();
    var id = args.shift();
    return removestoreitems(id, args, cb);
  }else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + groups.usage);
  }
}

// list groups
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/list", {}, "Error listing groups: ", function(err, groups){
    if(err) return cb(err);
    return cb(undefined, groups);
  });
}

// create user
function create(name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/create", {"name": name, "description": desc}, "Error creating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete group
function deleteGroup(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/delete", {"guid": id}, "Error deleting group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read group
function read(id, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/read", {"guid": id}, "Error reading group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update group
function update(id, name, desc, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/update", {"guid": id, "description": desc, "name": name}, "Error updating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add users to a group
function addusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/addusers", {"guid": id,  "users": users}, "Error adding users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove users from a group
function removeusers(id, users, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removeusers", {"guid": id,  "users": users}, "Error removing users: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// add store items to a group
function addstoreitems(id, storeitems, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/addstoreitems", {"guid": id, "storeitems": storeitems}, "Error adding apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// remove store items from a group
function removestoreitems(id, storeitems, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removestoreitems", {"guid": id,  "storeitems": storeitems}, "Error removing apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
groups.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "admin-storeitemgroups") argv.unshift("admin-storeitemgroups");
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
};
