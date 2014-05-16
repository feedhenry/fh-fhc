
module.exports = storeitems;
storeitems.usage = "\nfhc admin-storeitems list"
  +"\nfhc admin-storeitems create <name> [description=<description>] [authToken=<authToken>] [restrictToGroups=<restrictToGroups>]"
  +"\nfhc admin-storeitems delete <storeitem guid>"
  +"\nfhc admin-storeitems read <storeitem guid>"
  +"\nfhc admin-storeitems update <storeitem guid> <name> <description> <authToken>  [<restrictToGroups>]"
  +"\nfhc admin-storeitens uploadicon <storeitem guid> <path to icon>"
  +"\nfhc admin-storeitems uploadbinary <storeitem guid> <type iphone|android|ipad> <path to app binary>"
  +"\nfhc admin-storeitems addpolicy <storeitem guid> <policy_guid>"
  +"\nfhc admin-storeitems removepolicy <storeitem guid> <policy_guid>"
  +"\nfhc admin-storeitems listpolicies <storeitem guid>"
  +"\nfhc admin-storeitems grouprestrict <storeitem guid> <true|false>"
  +"\nfhc admin-storeitems addgroups <storeitem guid> <group_guid>*"
  +"\nfhc admin-storeitems removegroups <storeitem guid> <group_guid>*" +
  "\nfhc admin-storeitems binaryversions <storeiten guid> ";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');
var fs = require('fs');

function storeitems(args, cb){
    if(args.length === 0) return list(cb);
    if(args.length > 0){
      var action = args[0];

      switch(action){
        case "read":
          if(args.length < 2 )return cb(storeitems.usage);
          return read(args[1], cb);
        case "create":
          if(args.length < 2) return cb(storeitems.usage);
          args.splice(0,1);
          return create(args, cb);
        case "update":
          if(args.length < 4) return cb(storeitems.usage);
          return update(args[1], args, cb);
        case "list":
          return list(cb);
        case "delete":
          if(args.length < 2)return cb(storeitems.usage);
          return deleteItem(args[1],cb);
        case "uploadicon":
          if(args.length < 3) return cb(storeitems.usage);
          return addIcon(args[1], args[2], cb);
        case "uploadbinary":
          if(args.length < 4) return cb(storeitems.usage);
          return addBinary(args[1], args[2], args[3], cb);
        case "addpolicy":
          if(args.length < 3) return cb(storeitems.usage);
          return addPolicy(args[1],args[2],cb);
        case "grouprestrict":
          if(args.length < 3) return cb(storeitems.usage);
          return groupRestrict(args[1],args[2],cb);
        case "removepolicy":
          if(args.length < 3) return cb(storeitems.usage);
          return removePolicy(args[1],args[2],cb);
        case "listpolicies":
          if(args.length < 2) return cb(storeitems.usage);
          return listPolicies(args[1],cb);
        case "addgroups":
          if(args.length < 2) return cb(storeitems.usage);
          var act = args.shift();
          var id = args.shift();
          return addgroups(id, args, cb);
        case "removegroups":
          if(args.length < 2) return cb(storeitems.usage);
          var act = args.shift();
          var id = args.shift();
          return removegroups(id, args, cb);
        case "binaryversions":
          if(args.length < 2 )return cb(storeitems.usage);
          return binaryversions(args[1], cb);
        default :
          return cb(storeitems.usage);
      }
    }
}


function binaryversions(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/read", {"guid":guid}, "Error reading item: ", function(err, data){
    if(err) return cb(err);
     var ret = {"name":data.name};
     ret.versions = [];
     data.binaries.forEach(function (item){
        item.versions.forEach(function(it){
           ret.versions.push(it);
        });
     });
    return cb(undefined, ret);
  });
}

function groupRestrict(guid, restrictToGroups, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/grouprestrict", {"guid":guid,"restrictToGroups":restrictToGroups}, "Error set restrict-to-groups flag on item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function addPolicy(guid, pol, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addpolicy", {"guid":guid,"authguid":pol}, "Error adding policy to item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function removePolicy(guid, pol, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/removepolicy", {"guid":guid,"authguid":pol}, "Error removing policy from item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listPolicies(guid,cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/listpolicies", {"guid":guid}, "Error Listing item policies: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function list(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/list", {"payload":{}}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function read(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/read", {"guid":guid}, "Error reading item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function create(args, cb){
  var name = args.shift();
  var payload = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    payload[pair[0]] = parseVal(pair[0],pair[1]);
  });
  payload['name']= name;
  if(payload['restrictToGroups'] !== true) {
    payload['restrictToGroups']= false;
  }

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/create", payload, "Error creating item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });

}


function deleteItem(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/delete", {"guid":guid}, "Error deleting item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function update(guid, params, cb){
  var name = params[2];
  var desc = params[3];
  var authToken = params[4];
  var payload = {
    "name":name,
    "description":desc,
    "authToken":authToken,
    "guid":guid,
    "restrictToGroups":(params[5] === true || params[5] === "true")
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/update",payload, "Error updating item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function addIcon(guid, iconFile, cb){
  fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", iconFile, {"type":"icon", "guid":guid}, "application/octet-stream" ,function (err, ok){
      if(err)return cb(err);
      return cb(undefined,ok);
  });

}

function addBinary(guid, type, binary, cb){
    fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", binary, {"type":type,"guid":guid},  "application/octet-stream", function (err, ok){
       if(err) return cb(err);
       return cb(undefined, ok);
    });
}

// add groups to a storeitem
function addgroups(id, groups, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addgroups", {"guid": id,  "groups": groups}, "Error adding groups to storeitem: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}
// remove groups from a storeitem
function removegroups(id, groups, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/removegroups", {"guid": id,  "groups": groups}, "Error removing groups from storeitem: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}
function parseVal(name, val){
  if(val === "true"){
    return true;
  }
  if(val === "false"){
    return false;
  }
  return val;
}


// bash completion
storeitems.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;

  if (argv[1] !== "admin-storeitems") argv.unshift("admin-storeitems");
  if (argv.length === 2) {
    var cmds = ["read", "create", "update" , "list" , "delete" ,  "uploadicon", "uploadbinary", "addpolicy" , "removepolicy" , "listpolicies", "addgroups" ,  "removegroups",  "binaryversions"];
    if (opts.partialWord !== "l") cmds.push("list");
    return cb(undefined, cmds);
  }
  var action = argv[2];
  switch (action) {
    case "addgroups":
      common.getAppIds(cb);
      break;
    default: return cb(null, []);
  }
};
