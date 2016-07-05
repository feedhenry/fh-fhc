/* globals i18n */
module.exports = env;
env.list = list;

env.desc = i18n._("Cloud app environment variables");
env.usage = "fhc env create <app-guid> <var_name> [<var_value>] --env=<environment>"
  + "\nfhc env update <app-guid> <var_id> [<new_var_name>] [<var_value>] --env=<environment>"
  + "\nfhc env read <app-guid> <var_id> --env=<environment>"
  + "\nfhc env list <app-guid> --env=<environment>"
  + "\nfhc env listDeployed <app-guid> [includeSystemEnvironmentVariables] --env=<environment>"
  + "\nfhc env unset <app-guid> <var_id> --env=<environment>"
  + "\nfhc env delete <app-guid> <var_id>"
  + "\nfhc env push <app-guid> --env=<environment>";

var fhc = require("../../fhc");
var common = require("../../common");
var ini = require('../../utils/ini');
var _ = require('underscore');

var create = common.createAppEnv;
var read = common.readAppEnv;
var update = common.updateAppEnv;
var remove = common.deleteAppEnv;


// Main env entry point
function env(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(env.usage);
  }
  var envValue = ini.getEnvironment(argv);
  if (args.length === 1) {
    return list(fhc.appId(args[0]), envValue, cb);
  }
  var action = args[0],
    appId = fhc.appId(args[1]);
  switch (action) {
    case "create":
      var varName = args[2],
        value;
      if (args[3]) {
        // If a value is specified, append it & also ensure SOME env is set
        value = args[3];
        envValue = envValue || 'dev';
      }
      return create(appId, varName, value, envValue, cb);
    case "read":
      var envVarId = args[2];
      return read(appId, envVarId, envValue, cb);
    case "update":
      var envVarIdUpdate = args[2],
        varNameUpdate, valueUpdate;
      if (args[3]) {
        varName = args[3];
      }
      if (args[4]) {
        // If a value is specified, append it & also ensure SOME env is set
        value = args[4];
        envValue = envValue || 'dev';
      }
      return update(appId, envVarIdUpdate, varNameUpdate, valueUpdate, envValue, cb);
    case "delete":
      var envVarIdDelete = args[2];
      return remove(appId, envVarIdDelete, envValue, cb);
    case "list":
      return list(appId, envValue, cb);
    case "unset":
      var envVarIdUnset = args[2];
      if (!envValue) {
        return cb(env.usage);
      }
      return unset(appId, envVarIdUnset, envValue, cb);
    case "push":
      if (!envValue) {
        return cb(env.usage);
      }
      return push(appId, envValue, cb);
    case "listDeployed":
      var includeSys = false;
      if (!envValue) {
        return cb(env.usage);
      }
      if (args.length === 3) {
        includeSys = (args[2] === "true" || args[2] === true);
      }
      return listDeployed(appId, envValue, includeSys, cb);
    default :
      return cb(env.usage);
  }
}

function list(appId, envValue, cb) {
  common.listAppEnv(appId, envValue, function (err, data) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true && data.list) {
      env.table = common.createTableForAppEnvVars(data.list, envValue);
    }

    return cb(err, data);
  });
}

function listDeployed(appId, envValue, includeSys, cb) {
  var targetField = "devValue";
  if (envValue === "live") {
    targetField = "liveValue";
  }
  common.listAppEnv(appId, envValue, function (err, currentEnvs) {
    common.listDeployedAppEnv(appId, envValue, function (erro, deployedEnvs) {
      var allEnvs = {};

      _.each(currentEnvs.list, function (env) {
        var fields = env.fields;
        if (!allEnvs[fields.name]) {
          allEnvs[fields.name] = {};
        }
        allEnvs[fields.name].current = fields[targetField];
      });

      deployedEnvs = deployedEnvs.envvars;
      var filteredEnvs = _.filter(deployedEnvs, function (dk){
        return includeSys || deployedEnvs[dk].isSystemEnv;
      });

      _.each(filteredEnvs, function (dk) {
        if (!allEnvs[dk]) {
          allEnvs[dk] = {};
        }
        allEnvs[dk].deployed = deployedEnvs[dk].value;
      });


      var allenvlist = _.map(allEnvs, function(envk) {
        return {name: envk, currentValue: allEnvs[envk].current, deployedValue: allEnvs[envk].deployed};
      });

      env.table = common.createListTable({name: 20, currentValue: 30, deployedValue: 30}, allenvlist);
      return cb(err, allenvlist);
    });
  });
}

function unset(appId, envVarId, envValue, cb) {
  var params = {appId: appId, envVarId: envVarId};
  if (envValue === "dev") {
    params.devValue = true;
  }
  if (envValue === "live") {
    params.liveValue = true;
  }
  common.unsetAppEnv(params, function (err, data) {
    return cb(err, data);
  });
}

function push(appId, envValue, cb) {
  common.pushAppEnv(appId, envValue, function (err, data) {
    return cb(err, data);
  });
}

// bash completion
env.completion = function (opts, cb) {
  return cb(null, ['create', 'update', 'read', 'list', 'delete', 'listDeployed', 'push', 'unset']);
};
