
module.exports = appstore;
appstore.usage = "\nfhc admin-appstore list"
  +"\nfhc admin-appstore read"
  +"\nfhc admin-appstore update <name> <description> <appid1,apppid2>" +
  +"\nfhc admin-appstore updatefield <fieldname> <fieldvalue>"
  +"\nfhc admin-appstore listitems" +
  "\nfhc admin-appstore additem <StoreItem Guid>" +
  "\nfhc admin-appstore removeitem <StoreItem Guid>";

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

function appstore(args, cb){
  if(args.length === 0) return cb(this.usage);
  if(args.length > 0){
    var action = args[0];
    switch(action){
      case "read":
        return read(cb);
      case "update":
        return update(args[1], args[2], args[3], cb);
      case "updatefield":
        return updateField(args[1], args[2],cb);
      case "list":
        return list(cb);
      case "listitems":
        return listItems(cb);
      case "additem":
        return addItem(args[1], cb);
        break;
      case "removeitem":
        return removeItem(args[1],cb);
      case "uploadicon":
        return addIcon(args[1], cb);
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

function listItems(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/liststoreitems", {"payload":{}}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function addItem(guid,cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/additem", {"guid":guid}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function updateField(field, value, cb){
  var params = {};
  params[field] = value;
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/update", params, "Error updating store: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function removeItem(guid, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/removeitem", {"guid":guid}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function read( cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/read", {}, "Error reading store: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}


function update(name, description, items, cb){
  var storeItems = items.split(",");
  var payload = {
    "name":name,
    "description":description,
    "items":storeItems
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/update",payload, "Error updating item: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function addIcon(iconFile, cb){
  fhreq.uploadFile("/box/srv/1.1/admin/appstore/uploadbinary", iconFile, {}, "image/jpeg" ,function (err, ok){
    if(err)return cb(err);
    return cb(undefined,ok);
  });
}
