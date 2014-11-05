
module.exports = appstore;
appstore.desc = "View your Mobile App Store";
appstore.usage = "\nfhc admin-appstore read"
  +"\nfhc admin-appstore getstoreitems";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('../../utils/ini');
var Table = require('cli-table');
var fs = require('fs');

function appstore(argv, cb){
  var args = argv._;
  if(args.length === 0) return cb(appstore.usage);
  if(args.length > 0){
    var action = args[0];
    switch(action){
      case "read":
        return read(cb);
      case "getstoreitems":
        return getstoreitems(cb);
      default :
        return cb(appstore.usage);
    }
  }
}

function getstoreitems(cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/mas/appstore/getstoreitems", {"payload":{}}, "Error Listing items: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

function read( cb){
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/mas/appstore/read", {}, "Error reading store: ", function(err, data){
    if(err) return cb(err);
    return cb(undefined, data);
  });
}

// bash completion
appstore.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "mas-appstore") argv.unshift("mas-appstore");
  if (argv.length === 2) {
    var cmds = ["getstoreitems", "read"];
    if (opts.partialWord !== "r") cmds.push("getstoreitems");
    return cb(undefined, cmds);
  }
  return cb(null, []);
};
