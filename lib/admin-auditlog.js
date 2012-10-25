
module.exports = auditlog;
auditlog.usage = "\nfhc admin-auditlog listlogs [limit]" +
                "\nfhc admin-auditlog read <storeitem guid>";

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

function auditlog(args, cb){
  if(args.length === 0) return cb(auditlog.usage);
  if(args.length > 0){
    var action = args[0];
    switch(action){
      case "listlogs":
        return listlogs(cb,args[1]);
        break;
      case "read":
        if(args.length < 2) return cb(appstore.usage);
        return read(args[1], args[2], cb);
        break;
      default :
        return cb(auditlog.usage);
        break;
    }
  }
}

function listlogs(cb,limit){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/auditlog/listlogs", {"limit" : limit}, "Error Listing log: ", function(err, data){
    console.log("err=" , util.inspect(err));
    console.log("data=" , util.inspect(data));
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function read(guid,limit, cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/auditlog/read", {"guid":guid, "limit" : limit}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
auditlog.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "admin-auditlog") argv.unshift("admin-auditlog");
  if (argv.length === 2) {
    var cmds = ["listlogs"];
    if (opts.partialWord !== "l") cmds.push("listlogs", "read");
    return cb(undefined, cmds);
  }
  return cb(null, []);
};
