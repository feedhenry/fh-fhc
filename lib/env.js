
module.exports = env;
env.list = list;

env.usage = "\nfhc env";

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
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main env entry point
function env(args, cb){
  if(args.length === 0) return cb(env.usage);
  if(args.length > 0){
    var action = args[0];
    switch(action){
      case "create":
        var appId = fhc.appId(args[1]);
        var env = args[2] || 'live';
        var tupple= args[3].split(/=(.+)?/);
        var name = tupple[0];
        var value= tupple[1];
        return create(appId,env, name, value, cb);
        break;
      case "read":
        var appId = fhc.appId(args[1]);
        var envVarId = args[2];
        return read(appId,envVarId,cb);
        break;
      case "update":
        var appId = fhc.appId(args[1]);
        var envVarId = args[2] || 'live';
        var tupple= args[3].split(/=(.+)?/);
        var name = tupple[0];
        var value= tupple[1];
        return update(appId,envVarId, name, value,cb);
        break;
      case "delete":
        var appId = fhc.appId(args[1]);
        var envVarId = args[2];
        return remove(appId,envVarId, name, value,cb);
        break;
      case "list":
        var appId = fhc.appId(args[1]);
        var env = args[2] || 'live';
        return list(appId,env, cb);
        break;
      default :
        return cb(env.usage);
        break;
    }
  }
}

// list env
function create(appId, env, name, value, cb) {
  common.createAppEnv(appId, env, name, value, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForApps(data.list);
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) filter = ini.get('bare');
      env.bare = '';
      for (var a in data.list) {
        var app = data.list[a];
        if (env.bare !== '') env.bare = env.bare + '\n';
        env.bare = env.bare + app[filter];
      }
    }
    return cb(err, data);
  });
}


// list env
function read(appId, envVarId, cb) {
  common.readAppEnv(appId, envVarId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForApps(data.list);
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) filter = ini.get('bare');
      env.bare = '';
      for (var a in data.list) {
        var app = data.list[a];
        if (env.bare !== '') env.bare = env.bare + '\n';
        env.bare = env.bare + app[filter];
      }
    }
    return cb(err, data);
  });
}


// list env
function update(appId, env, name, value, cb) {
  common.updateAppEnv(appId, env, name, value, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForApps(data.list);
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) filter = ini.get('bare');
      env.bare = '';
      for (var a in data.list) {
        var app = data.list[a];
        if (env.bare !== '') env.bare = env.bare + '\n';
        env.bare = env.bare + app[filter];
      }
    }
    return cb(err, data);
  });
}

// list env
function remove(appId, envVarId, cb) {
  common.deleteAppEnv(appId, envVarId, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForApps(data.list);
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) filter = ini.get('bare');
      env.bare = '';
      for (var a in data.list) {
        var app = data.list[a];
        if (env.bare !== '') env.bare = env.bare + '\n';
        env.bare = env.bare + app[filter];
      }
    }
    return cb(err, data);
  });
}


// list env
function list(appId, env, cb) {
  common.listAppEnv(appId, env, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForApps(data.list);
    }

    if ('' !== ini.get('bare')) {
      var filter = 'id';
      if(ini.get('bare') !== true) filter = ini.get('bare');
      env.bare = '';
      for (var a in data.list) {
        var app = data.list[a];
        if (env.bare !== '') env.bare = env.bare + '\n';
        env.bare = env.bare + app[filter];
      }
    }
    return cb(err, data);
  });
}


// bash completion
env.completion = function (opts, cb) {
};
