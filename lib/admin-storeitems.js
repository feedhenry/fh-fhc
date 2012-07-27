
module.exports = storeitems;
storeitems.usage = "\nfhc admin-storeitems list"
  +"\nfhc admin-storeitems create <name> <description> <authToken>"
  +"\nfhc admin-storeitems delete <storeitem guid>"
  +"\nfhc admin-storeitems read <storeitem guid>"
  +"\nfhc admin-storeitems update <name> <description> <authToken";

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
          return read(args[1], cb);
        case "create":
          args.splice(0,1);
          return create(args, cb);
        case "update":
          return update(args[1], args, cb);
        case "list":
          return list(cb);
        case "delete":
          return deleteItem(args[1],cb);
        case "listgroups":
          return listItemGroups(args[1], cb);
          break;
        case "addgroup":
          return addItemGroup(args[1], args[2], cb);
          break;
        case "removegroup":
          return removeGroupFromItem(args[1], args[2],cb);
        case "uploadicon":
          return addIcon(args[1], args[2], cb);
        case "uploadbinary":
          return addBinary(args[1], args[2], args[3], cb);
        default :
          return cb(this.usage);
          break;
      }
    }
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


function create(params, cb){
  var name = params[0];
  var desc = params[1];
  var authToken = params[2];
  var payload = {
    "name":name,
    "description":desc,
    "authToken":authToken
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/create", payload, "Error creating item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });

}


function deleteItem(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/delete", {"guid":guid}, "Error deleting device: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function listItemGroups(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/listgroups", {"guid":guid}, "Error listing item groups: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function addItemGroup(guid,groups, cb){
  var gs = groups.split(",");

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addgroup", {"guid":guid,"groupnames":gs}, "Error adding item group: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function removeGroupFromItem(guid, group, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/removegroup", {"guid":guid,"group":group}, "Error removing item group: ", function(err, data){
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
    "guid":guid
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

function addBinary(guid, destination, binary, cb){
    fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", binary, {"type":"storeitem","guid":guid,"destination":destination},  "application/octet-stream", function (err, ok){
       if(err) return cb(err);
       return cb(undefined, ok);
    });
}
