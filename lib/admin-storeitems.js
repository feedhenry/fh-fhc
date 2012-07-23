
module.exports = storeitems;
storeitems.usage = "\nfhc admin-storeitems list"
  +"\nfhc devices create <name> <description> <authToken>"
  +"\nfhc devices delete <storeitem guid>"
  +"\nfhc devices read <storeitem guid>"
  +"\nfhc devices update <device-id> <description> <make> <model> <enabled> <blocked>"
  +"\nfhc devices addusers <device-id> <user-email>*"
  +"\nfhc devices removeusers <device-id> <user-email>*"
  +"\nfhc devices approvals <device-id>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');
function storeitems(args, cb){
    if(args.length === 0) return list(cb);
    if(args.length > 0){
      var action = args[0];

      switch(action){
        case "read":
          return read(args[1], cb);
        case "create":
          args.splice(0,1);
          return create(args, cb);
        case "list":
          return list(cb);
        case "delete":
          return deleteItem(args[1],cb);
        case "listgroups":

          return listItemGroups(guid, cb);
          break;
        case "addgroup":
          return addItemGroup(args[1], args[2], cb);
          break;
        default :
          return cb();
          break;
      }
    }
}


function list(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/list", {"payload":{}}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function read(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/read", {"guid":guid}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function create(params, cb){
  var name = params[0];
  var desc = params[1];
  var authToken = params[2];
  var payload = {
    "name":name,
    "description":desc,
    "authToken":authToken
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/create", payload, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });

}


function deleteItem(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/delete", {"guid":guid}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listItemGroups(guid, cb){
  console.log(guid.length, guid);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/listgroups", {"guid":guid}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function addItemGroup(guid,groups, cb){
  var gs = groups.split(",");
  console.log(gs);
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addgroup", {"guid":guid,"groupnames":gs}, "Error creating device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}