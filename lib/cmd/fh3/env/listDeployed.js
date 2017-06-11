/* globals i18n */
var common = require("../../../common");
var util = require('util');
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var _ = require("underscore");

module.exports = {
  'desc' : i18n._('List deployed cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env listDeployed --app=<app> --includeSystemEnvironmentVariables=<true> --env=<environment>',
      desc : "List deployed cloud app environment variables from the <app> and <env>"
    }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    'includeSystemEnvironmentVariables': 'i',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'includeSystemEnvironmentVariables',
    2: 'env',
    3: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    var targetField = "devValue";
    if (params.env === "live") {
      targetField = "liveValue";
    }
    fhc.env.list({app:params.app, env:params.env},cb, function(err,envs) {
      if (err) {
        return cb(err);
      }
      common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/app/envvariable/listDeployed" , {appId: params.app, env: params.env}, i18n._("Error listing deployed env vars:"), function(err, deployedEnvs) {
        var allEnvs = addTargetFieldForAllEnvs(envs,targetField);
        deployedEnvs = deployedEnvs.envvars;
        var filteredEnvs = filterEnvsByIncluseSystem(deployedEnvs, params);
        allEnvs = addDeployedValueForFilteredEnvs(filteredEnvs, allEnvs, deployedEnvs);
        var result = mapResult(allEnvs);

        if (!params.json) {
          if (result && result.length > 0) {
            params._table = common.createListTable({name: 20, currentValue: 30, deployedValue: 30}, result);
            return cb(err, params);
          } else {
            cb(null, util.format(i18n._("Not found deployed environment variables for the app '%s' into the environment '%s'"), params.app, params.env));
          }
        } else {
          return cb(result);
        }
      });
    });
  }
};

/**
 * Add the value of targetField for all envs
 * @param envs
 * @param targetField
 * @returns {{}}
 */
function addTargetFieldForAllEnvs(envs,targetField) {
  var allEnvs = {};
  _.each(envs.list, function(env) {
    var fields = env.fields;
    if (!allEnvs[fields.name]) {
      allEnvs[fields.name] = {};
    }
    allEnvs[fields.name].current = fields[targetField];
  });
  return allEnvs;
}

/**
 * Filter by includeSystemEnvironmentVariables if it informed in the command
 * or by the value returned into deployedEnvs
 * @param deployedEnvs
 * @param params
 */
function filterEnvsByIncluseSystem(deployedEnvs, params) {
  var filteredEnvs = _.filter(deployedEnvs, function(dk) {
    return params.includeSystemEnvironmentVariables || deployedEnvs[dk].isSystemEnv;
  });
  return filteredEnvs;
}

/**
 * Add deployed value parameter for each env in the list.
 * The value set is from the deployedEnvs.
 * @param filteredEnvs
 * @param allEnvs
 * @param deployedEnvs
 * @returns {*}
 */
function addDeployedValueForFilteredEnvs(filteredEnvs, allEnvs, deployedEnvs) {
  _.each(filteredEnvs, function(dk) {
    if (!allEnvs[dk]) {
      allEnvs[dk] = {};
    }
    allEnvs[dk].deployed = deployedEnvs[dk].value;
  });
  return allEnvs;
}

/**
 * Map the result of this command
 * @param allEnvs
 */
function mapResult(allEnvs) {
  var allenvlist = _.map(allEnvs, function(envk) {
    return {name: envk, currentValue: allEnvs[envk].current, deployedValue: allEnvs[envk].deployed};
  });
  return allenvlist;
}