module.exports = clusterprops;

clusterprops.desc = "Manage clusterprops";
clusterprops.usage = "fhc admin clusterprops \n fhc admin clusterprops read <name> \n";
clusterprops.updateUsage = "fhc admin clusterprops update <prop> <value>";
clusterprops.createUsage = "fhc admin clusterprops create <prop> <value>";
clusterprops.deleteUsage = "fhc admin clusterprops del <prop>";
clusterprops.listUsage = "fhc admin clusterprops";

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
  if (args.length === 1) return listClusterProps(argv, cb);

  var action = args[0];
  if ("list" === action || undefined === action) {
    return listClusterProps(args, cb);
  } if ("read" === action) {
    return readClusterProp(args, cb);
  } if ("update" === action) {
    return updateClusterProp(args,cb);
  } if("create" === action){
    return createClusterProp(args,cb);
  } if("del" === action){
    return deleteClusterProp(args,cb);
  }

  else {
    return unknown("Invalid action: " + action, cb);
  }
}

function listClusterProps(args, cb){
  var url = "/box/api/clusters/properties";
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Cluster Props: ", function(err, props){
    if (err) return cb(err);

    clusterprops.table = common.createTableForProperties("cluster",{"max":130},props);


    return cb(err, props);
  });
}

function readClusterProp(args, cb){
  var prop = args[1];
  if(! prop)return cb("no prop passed in");
  var url = "/box/api/clusters/properties/" + prop;
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error reading Cluster Props: ", function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",{max:500},[props]);
    }

    return cb(err, props);
  });
}

function updateClusterProp(args,cb){
  var prop = args[1];
  var value = args[2];
  if(! prop || ! value) return cb(clusterprops.updateUsage);
  var payload = {"key":prop,"value":value};
  var url = "/box/api/clusters/properties/" + prop;
  common.doPutApiCall(fhreq.getFeedHenryUrl(), url, payload, function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",{max:500},[props]);
    }

    return cb(err, props);
  });
}


function createClusterProp(args,cb){
  var prop = args[1];
  var value = args[2];
  if(! prop || ! value) return cb(clusterprops.updateUsage);
  var payload = {"key":prop,"value":value};
  var url = "/box/api/clusters/properties";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, "failed to create cluster prop",function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",{max:500},[props]);
    }

    return cb(err, props);
  });
}


function deleteClusterProp(args,cb){
  var prop = args[1];
  if(! prop) return cb(clusterprops.deleteUsage);

  var url = "/box/api/clusters/properties/" + prop ;
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), url, {}, "failed to delete cluster prop",function(err, props){
    if (err) return cb(err);
    if (ini.get('table') === true) {
      clusterprops.table = common.createTableForProperties("cluster",{max:500},[props]);
    }

    return cb(err, props);
  });
}
