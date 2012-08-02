
module.exports = storeitems;
storeitems.usage = "\nfhc admin-storeitems list"
  +"\nfhc admin-storeitems create <name> <description> <authToken>"
  +"\nfhc admin-storeitems delete <storeitem guid>"
  +"\nfhc admin-storeitems read <storeitem guid>"
  +"\nfhc admin-storeitems update <storeitem guid> <name> <description> <authToken>"
  +"\nfhc admin-storeitens uploadicon <storeitem guid> <path to icon>"
  +"\nfhc admin-storeitems uploadbinary <storeitem guid> <type iphone|android|ipad> <path to app binary>"
  +"\nfhc admin-storeitems addpolicy <storeitem guid> <policy_guid>"
  +"\nfhc admin-storeitems removepolicy <storeitem guid> <policy_guid>"
  +"\nfhc admin-storeitems listpolicies <storeitem guid>";

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
          if(args.length < 4) return cb(storeitems.usage);
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
        case "removepolicy":
          if(args.length < 3) return cb(storeitems.usage);
          return removePolicy(args[1],args[2],cb);
        case "listpolicies":
          if(args.length < 2) return cb(storeitems.usage);
          return listPolicies(args[1],cb);      
        default :
          return cb(storeitems.usage);
          break;
      }
    }
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
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/delete", {"guid":guid}, "Error deleting item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// function listItemGroups(guid, cb){
//   common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/listgroups", {"guid":guid}, "Error listing item groups: ", function(err, data){
//     if(err) return cb(err);
//     return cb(undefined, data);
//   });
// }

// function addItemGroup(guid,groups, cb){
//   var gs = groups.split(",");

//   common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addgroup", {"guid":guid,"groupnames":gs}, "Error adding item group: ", function(err, data){
//     if(err) return cb(err);
//     return cb(undefined, data);
//   });
// }

// function removeGroupFromItem(guid, group, cb){
//   common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/removegroup", {"guid":guid,"group":group}, "Error removing item group: ", function(err, data){
//     if(err) return cb(err);
//     return cb(undefined, data);
//   });
// }

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
    fhreq.uploadFile("/box/srv/1.1/admin/storeitem/uploadbinary", binary, {"type":"iphone","guid":guid,"destination":destination},  "application/octet-stream", function (err, ok){
       if(err) return cb(err);
       return cb(undefined, ok);
    });
}
