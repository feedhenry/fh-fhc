
module.exports = env;
env.list = list;

env.usage = "fhc env create <app-guid> <var_name> [<var_value>] --env=<environment>"
          +"\nfhc env update <app-guid> <var_id> [<new_var_name>] [<var_value>] --env=<environment>"
          +"\nfhc env read <app-guid> <var_id> --env=<environment>"
          +"\nfhc env list <app-guid> --env=<environment>"
          +"\nfhc env listDeployed <app-guid> [includeSystemEnvironmentVariables] --env=<environment>"
          +"\nfhc env unset <app-guid> <var_id> --env=<environment>"
          +"\nfhc env delete <app-guid> <var_id>"
          +"\nfhc env push <app-guid> --env=<environment>";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var ini = require('../../utils/ini');
var Table = require('cli-table');

// Main env entry point
function env(args, cb){
  if(args.length === 0){
    return cb(env.usage);
  } 
  var envValue = ini.getEnvironment(args);
  if(args.length === 1){
    return list(fhc.appId(args[0]), envValue, cb);
  }
  var action = args[0],
  appId = fhc.appId(args[1]);
  switch(action){
    case "create":
      var varName = args[2],
      value;

      if(args[3]){
        // If a value is specified, append it & also ensure SOME env is set
        value = args[3];
        envValue = envValue || 'dev';
      }

      return create(appId, varName, value, envValue, cb);
    case "read":
      var envVarId = args[2];
      return read(appId,envVarId, envValue, cb);
    case "update":
      var envVarId = args[2],
      varName, value;
      if(args[3]){
        varName = args[3];
      }
      if(args[4]){
        // If a value is specified, append it & also ensure SOME env is set
        value = args[4];
        envValue = envValue || 'dev';
      }
      return update(appId,envVarId, varName, value, envValue, cb);
    case "delete":
      var envVarId = args[2];
      return remove(appId,envVarId, envValue, cb);
    case "list":
      return list(appId,envValue, cb);
    case "unset":
      var envVarId = args[2];
      if(!envValue){
        return cb(env.usage);
      }
      return unset(appId, envVarId, envValue, cb);
    case "push":
      if(!envValue){
        return cb(env.usage);
      }
      return push(appId, envValue, cb);
    case "listDeployed":
      var includeSys = false;
      if(!envValue){
        return cb(env.usage);
      }
      if(args.length === 3){
        includeSys = (args[2] === "true" || args[2] === true);
      }
      return listDeployed(appId, envValue, includeSys, cb);
    default :
      return cb(env.usage);
  }
  
}

function create(appId, varName, value, env, cb) {
  common.createAppEnv(appId, varName, value, env, function(err, data){
    if(err) return cb(err);
    return cb(err, data);
  });
}


function read(appId,envVarId, envValue, cb) {
  common.readAppEnv(appId, envVarId, envValue, function(err, data){
    if(err) return cb(err);
    return cb(err, data);
  });
}


function update(appId, envVarId, varName, value, env, cb) {
  common.updateAppEnv(appId, envVarId, varName, value, env, function(err, data){
    if(err) return cb(err);
    return cb(err, data);
  });
}

function remove(appId, envVarId, envValue, cb) {
  common.deleteAppEnv(appId, envVarId, envValue, function(err, data){
    return cb(err, data);
  });
}


// list env
function list(appId, envValue, cb) {
  common.listAppEnv(appId, envValue, function(err, data){
    if(err) return cb(err);

    if(ini.get('table') === true && data.list) {
      env.table = common.createTableForAppEnvVars(data.list, envValue);
    }

    return cb(err, data);
  });
}

function listDeployed(appId, envValue, includeSys, cb){
  var targetField = "devValue";
  if(envValue === "live"){
    targetField = "liveValue";
  }
  common.listAppEnv(appId, envValue, function(err, currentEnvs){
    common.listDeployedAppEnv(appId, envValue, function(erro, deployedEnvs){
      var allEnvs = {};
      if(currentEnvs.list){
        for(var i=0;i<currentEnvs.list.length;i++){
          var fields = currentEnvs.list[i].fields;
          if(allEnvs[fields.name]){
            allEnvs[fields.name].current = fields[targetField];
          } else {
            allEnvs[fields.name] = {current: fields[targetField]};
          }
        }
      }
      deployedEnvs = deployedEnvs.envvars;
      for(var dk in deployedEnvs){
        if(deployedEnvs.hasOwnProperty(dk)){
          if(!includeSys){
            if(deployedEnvs[dk].isSystemEnv){
              continue;
            }
          }
          if(allEnvs[dk]){
            allEnvs[dk].deployed = deployedEnvs[dk].value;
          } else {
            allEnvs[dk] = {deployed: deployedEnvs[dk].value};
          }
        }
      }
      var allenvlist = [];
      for(var envk in allEnvs){
        if(allEnvs.hasOwnProperty(envk)){
          allenvlist.push({name: envk, currentValue: allEnvs[envk].current, deployedValue: allEnvs[envk].deployed});
        }
      }
      env.table = common.createListTable({name: 20, currentValue: 30, deployedValue: 30}, allenvlist);
      return cb(err, allenvlist);
    });
  });
}

function unset(appId, envVarId, envValue, cb){
  var params = {appId: appId, envVarId: envVarId};
  if(envValue === "dev"){
    params.devValue = true;
  }
  if(envValue === "live"){
    params.liveValue = true;
  }
  common.unsetAppEnv(params, function(err, data){
    return cb(err, data);
  });
}

function push(appId, envValue, cb){
  common.pushAppEnv(appId, envValue, function(err, data){
    return cb(err, data);
  });
}


// bash completion
env.completion = function (opts, cb) {
  return cb(null, ['create', 'update', 'read', 'list', 'delete', 'listDeployed', 'push', 'unset']);
};
