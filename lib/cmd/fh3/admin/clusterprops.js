module.exports = clusterprops;

clusterprops.desc = "Manage clusterprops";
clusterprops.usage = "fhc admin clusterprops \n fhc admin clusterprops read <name> \n";

var common = require("../../../common");
var fhreq = require("../../../utils/request");
var ini = require('../../../utils/ini');
var _ = require('underscore');
var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + clusterprops.usage);
}

function clusterprops(argv, cb) {
  var args = argv._;
  if (args.length === 1) return listclusterprops(argv, cb);

  var action = args[0];
  if ("list" === action || undefined === action) {
    return listclusterprops(argv, cb);
  } if ("read" === action) {
    //return readConnection(argv, cb);
  } if ("update" === action) {
    //return updateConnection(argv, cb);
  } else {
    return unknown("Invalid action: " + action, cb);
  }
}

function listclusterprops(args, cb){
  var url = "/box/api/clusters/properties";
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Cluster Props: ", function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",props);
    }

    return cb(err, props);
  });
}

function readclusterprop(args, cb){
  var url = "/box/api/clusters/properties";
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Cluster Props: ", function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",props);
    }

    return cb(err, props);
  });
}


//module.exports = {
//  'desc' : 'read a clusters properties.',
//  'examples' : [{ cmd : 'fhc admin clusterprops ', desc : 'read a clusters props'}],
//  'demand' : [],
//  'alias' : {},
//  'describe' : {
//  },
//  'url' : function(params){
//    return '/box/api/clusters/properties'
//  },
//  'method' : 'get'
//};
