/* globals i18n */
var common = require("../../../common");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Read cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env read --app=<app> --id=<id> --env=<environment>',
      desc : "Read a cloud app environment variables with the <id> from the <app> into the <env>"
    }],
  'demand' : ['app', 'id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'env': 'e',
    0: 'app',
    1: 'id',
    2: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    fhc.env.list({app:params.app, env:params.env, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      var found = findEnvironment(params,data);
      if ( found ) {
        if (!params.json) {
          params._table = common.createTableForAppEnvVars([found], params.env);
          return cb(null, params);
        } else {
          return cb(null, found);
        }
      }
      return cb(null, util.format(i18n._("Not found environment variable for the app '%s' with the id '%s'"), params.app, params.id));

    });
  }
};

/**
 * Filter by the id of the environment variable informed
 * @param params
 * @param data
 * @returns {{}}
 */
function findEnvironment(params,data) {
  var found ;
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].guid === params.id) {
        found = data[i];
        break;
      }
    }
  }
  return found;
}