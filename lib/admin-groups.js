
module.exports = groups;
groups.list = list;
groups.create = create;
groups.deleteGroup = deleteGroup;
groups.read = read;
groups.update = update;

groups.usage = "\nfhc groups list"
              +"\nfhc groups create <group-name>"
              +"\nfhc groups delete <group-id>"
              +"\nfhc groups read <group-id>"
              +"\nfhc groups update <group-id> <group-name>"

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
    if (args.length !== 2) return cb("Invalid arguments for 'create':" + groups.usage);
    return create(args[1], cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + groups.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length !== 3) return cb("Invalid arguments for 'update':" + groups.usage);
    return update(args[1], args[2], cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + groups.usage);
    return deleteGroup(args[1], cb);
  }else{
    return cb("Unknown command '" + action + "'. Usage: " + groups.usage);
  }
}

// list groups
function list(cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/group/list", {}, "Error listing groups: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(name, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/group/create", {"name": name}, "Error creating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// delete group
function deleteGroup(id, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/group/delete", {"guid": id}, "Error deleting group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// read group
function read(id, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/group/read", {"guid": id}, "Error reading group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// update group
function update(id, name, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/group/update", {"guid": id, "name": name}, "Error updating group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


// bash completion
groups.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "groups") argv.unshift("groups");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
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
