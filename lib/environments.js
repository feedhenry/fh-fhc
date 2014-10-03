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
	var target = ini.get('env') || null;
	if (!target && args.length>0){
		target = 'dev';
	}
	if(args.length === 0) return doEnvironmentResources(target, null, cb);
  if(args.length === 1 && args[0] === 'resources') return doEnvironmentResources(target, args[0], cb);
  if(args.length === 2 && args[0] === 'cache' && args[1] === 'flush') return doCacheFlush(target, cb);
	// -1 gets dropped in an 'args' array, so assume 3 is inifinte cache
  if(args.length === 3 && args[0] === 'cache' && args[1] === 'set') return doCacheSet(target, args[2], -1, cb);
	if(args.length === 4 && args[0] === 'cache' && args[1] === 'set') return doCacheSet(target, args[2], args[3], cb);
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
                     "fhc environments [--env=<environment>]\n" +
                     "fhc environments resources [--env=<environment>]\n" +
                     "fhc environments cache [flush] [--env=<environment>]\n" +
                     "fhc environments cache [set] [type] [value] (where 'type' is either 'percent' or 'size') [--env=<environment>]\n" +
                     "e.g. fhc environments --env=dev\n" +
                     "e.g. fhc environments resources --env=dev\n" +
                     "e.g. fhc environments cache flush --env=dev\n" +
                     "e.g. fhc environments cache set percent 50 --env=dev\n" +
                     "e.g. fhc environments cache set size 524288000 --env=live\n\n"+
										"[--env] is assumed to be 'dev' if omitted.\n"+
										"To set unlimited cache size, use 'fhc environments cache set size -1'\n";
module.exports =  environments;
