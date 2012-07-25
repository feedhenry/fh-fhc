
module.exports = users;
users.list = list;
users.create = create;
users.read = read;
users.delete = deleteUser;
users.update = update;
users.import = importUsers;

users.usage = "\nfhc admin-users list"
             +"\nfhc admin-users create username=<username> [password=<password>] [email=<email>] [name=<name>] [roles=<roles>] [invite=<invitation>]"
             +"\nfhc admin-users delete <username>"
             +"\nfhc admin-users read <username>"
             +"\nfhc admin-users update username=<username> [password=<password>] [email=<email>] [name=<name>] [roles=<roles>] [inviation=<invitation>] [enabled=<enabled>]"
             +"\nfhc admin-users enable <username>"
             +"\nfhc admin-users disable <username>"
             +"\nfhc admin-users changeroles <username> <roles>"
             +"\nfhc admin-users listdevices <username>"
             +"\nfhc admin-users listinstallapps <username>"
             +"\nfhc admin-users import <path-to-csv-file> [invite] [<roles>]"


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
    if (args.length < 2) return cb("Invalid arguments for 'create':" + users.usage);
    return create(args, cb);
  }else if (action === 'read'){
    if (args.length !== 2) return cb("Invalid arguments for 'read':" + users.usage);
    return read(args[1], cb);
  }else if (action === 'update'){
    if (args.length < 2 ) return cb("Invalid arguments for 'update':" + users.usage);
    return update(args, cb);
  }else if (action === 'delete'){
    if (args.length !== 2) return cb("Invalid arguments for 'delete':" + users.usage);
    return deleteUser(args[1], cb);
  }else if (action === 'enable'){
    if (args.length !== 2) return cb("Invalid arguments for 'enable':" + users.usage);
    return enableUser(args[1], cb);
  }else if (action === 'disable'){
    if (args.length !== 2) return cb("Invalid arguments for 'disable':" + users.usage);
    return disableUser(args[1], cb);
  }else if (action === 'changeroles'){
    if (args.length !== 3) return cb("Invalid arguments for 'changeroles':" + users.usage);
    return changeRoles(args[1], args[2], cb);
  }/*else if (action === 'changegroups'){
    if (args.length !== 3) return cb("Invalid arguments for 'changegroups':" + users.usage);
    return changeGroups(args[1], args[2], cb);
  }*/else if (action === 'listdevices'){
    if (args.length !== 2) return cb("Invalid arguments for 'listdevices':" + users.usage);
    return listDevices(args[1], cb);
  }else if (action === 'listinstallapps'){
    if (args.length !== 2) return cb("Invalid arguments for 'listinstallapps':" + users.usage);
    return listInstallApps( args[1], cb);
  }else if(action === 'import'){
    if(args.length < 2) return cb("Invalid arguments for 'import': " + users.usage);
    return importUsers(args, cb);
  }else if (args.length == 1){
    var appId = fhc.appId(args[0]);
    return read(appId, cb);
  }else{
    return cb(users.usage);
  }
}

// list users
function list(cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/list", {}, "Error listing users: ", function(err, users){
    if(err) return cb(err);
    return cb(undefined, users);
  });
}

// create user
function create(args, cb) {
  var data = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    data[pair[0]] = parseVal(pair[1]);
  })
  if(!data.username){
    return cb(new Error("username is undefined"));
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/create", data, "Error creating user: ", function(err, res){
    if(err) return cb(err);
    return cb(undefined, res);
  });
}

// delete user
function deleteUser(username, cb) {
  var data = {"username" : username};  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/delete", data, "Error deleting user: ", function(err, res){
    if(err) return cb(err);
    return cb(undefined, res);
  });
}

// update user
function update(args, cb) {  
  var data = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    data[pair[0]] = parseVal(pair[1]);
  })
  if(!data.username){
    return cb(new Error("username is undefined"));
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/update", data, "Error updating user: ", function(err, res){
    if(err) return cb(err);
    return cb(undefined, res);
  });
}

// read user
function read(username, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/read", {"username": username}, "Error reading user: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function enableUser(username, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/update", {username: username, enabled: true}, "Error updating user: ", function(err, res){
    if(err) return cb(err);
    return cb(undefined, res);
  });
}

function disableUser(username, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/update", {username: username, enabled: false}, "Error updating user: ", function(err, res){
    if(err) return cb(err);
    return cb(undefined, res);
  });
}

function changeRoles(username, roles, cb){
  update(["username=" + username, "roles=" + roles], cb);
}

function changeGroups(username, groups, cb){
  update(["username=" + username, "groups=" + groups], cb);
}

function listDevices(username, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/listdevices", {"username": username}, "Error listing user devices: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listInstallApps(username, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/liststoreitems", {"username": username}, "Error listing user installed apps: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function importUsers(args, cb){
  var roles = "";
  var filepath = args[1];
  var invite = false;
  if(args.length == 3){
    if(args[2].indexOf("true") > 0 || args[2].indexOf("false") > 0){
      invite = args[2] === "true" ? true: false;
    } else {
      roles = args[2];
    }
  }
  if(args.length == 4){
    invite = args[2] === "true" ? true: false;
    roles = args[3];
  }
  var url = "/box/srv/1.1/admin/user/import";
  fhreq.uploadFile(url, filepath, {"invite": invite, "roles": roles}, "text/csv", function(err, res){
    if(err) return cb(err);
    if(res.status.toLowerCase() == "ok" && res.cachekey){
      common.waitFor(res.cachekey, cb);
    } else {
      cb(res.message);
    }
  })
}

function parseVal(val){
  if(val === "true"){
    return true;
  }
  if(val === "false"){
    return false;
  }
  return val;
}

// bash completion
users.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "users") argv.unshift("users");
  if (argv.length === 2) {
    var cmds = ["list", "read", "create", "update", "delete", "enable", "disable", "changeroles", "listdevices", "listinstallapps"];
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
