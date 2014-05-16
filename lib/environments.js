var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("./utils/exec.js");
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');

function environments (args, cb){
	var deployTarget = ini.get("live");
	var target = deployTarget === "live" ? "live"  : 'dev';
	if(args.length === 0) return doEnvironmentResources(null, null, cb);
  if(args.length === 1) return doEnvironmentResources(args[0], null, cb);
  if(args.length === 2 && args[1] === 'resources') return doEnvironmentResources(args[0], args[1], cb);
  if(args.length === 3 && args[1] === 'cache' && args[2] === 'flush') return doCacheFlush(args[0], cb);
  if(args.length === 5 && args[1] === 'cache' && args[2] === 'set') return doCacheSet(args[0], args[2], args[3], args[4], cb);
  return cb(environments.usage);

  function doEnvironmentResources(env, resources, cb) {
    var url = "box/srv/1.1/environments";
    if (env) url = url + '/' + env;
    if (resources) url = url + '/' + resources;
	  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Call failed: ", function(err, data) {
		  if (err) return cb(err);
		  return cb(err, data);
	  });
  }

  function doCacheFlush(env, cb) {
    var url = "box/srv/1.1/environments/" + env + "/cache/flush";
	  common.doApiCall(fhreq.getFeedHenryUrl(), url, {env: env}, "Call failed: ", function(err, data) {
		  if (err) return cb(err);
		  return cb(err, data);
	  });
  }

  function doCacheSet(env, type, value, cb) {
    var url = "box/srv/1.1/environments/" + env + "/cache/set";
	  common.doApiCall(fhreq.getFeedHenryUrl(), url, {cache: {type: type, value: value}}, "Call failed: ", function(err, data) {
		  if (err) return cb(err);
		  return cb(err, data);
	  });
  }
}

environments.usage = "fhc environments\n" +
                     "fhc environments [env]\n" +
                     "fhc environments [env] resources\n" +
                     "fhc environments [env] cache [flush]\n" +
                     "fhc environments [env] cache [set] [type] [value] (where 'type' is either 'percent' or 'size')\n" +
                     "e.g. fhc environments dev\n" +
                     "e.g. fhc environments dev resources\n" +
                     "e.g. fhc environments dev cache flush\n" +
                     "e.g. fhc environments dev cache set percent 50\n" +
                     "e.g. fhc environments dev cache set size 524288000\n";
module.exports =  environments;