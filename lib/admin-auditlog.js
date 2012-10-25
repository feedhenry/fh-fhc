
module.exports = auditlog;
auditlog.usage = "\nfhc admin-auditlog listlogs [limit=<limit>] [guid=<store item guid>] [type=<android|iphone>] [user=<user guid>] [device=<device guid>]";

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
        return listlogs(cb,args);
        break;
      default :
        return cb(auditlog.usage);
        break;
    }
  }
}

function listlogs(cb,args){
  var data = {};
  args.forEach(function(arg){
    var pair = arg.split("=");
    data[pair[0]] = parseVal(pair[0],pair[1]);
  })
  if(!data.limit)data.limit = 20;

  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/auditlog/listlogs", data, "Error Listing log: ", function(err, data){
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
auditlog.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "admin-auditlog") argv.unshift("admin-auditlog");
  if (argv.length === 2) {
    var cmds = ["listlogs"];
    if (opts.partialWord !== "l") cmds.push("listlogs");
    return cb(undefined, cmds);
  }
  return cb(null, []);
};
