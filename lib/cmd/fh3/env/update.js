/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Update cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env update --app=<app> --id=<id> --value=<value> --env=<environment>',
      desc : i18n._("Update the cloud app environment variables with the <id> from the <app> in the <env> with the <name> and <value>")
    },
    {
      cmd : 'fhc env update --app=<app> --id=<id> --mask',
      desc : i18n._("Update the cloud app environment variables with the <id> from the <app> in the <env> to be masked")
    }],
  'demand' : ['app', 'id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'value': 'v',
    'env': 'e',
    'mask': 'm',
    'json': 'j',
    0: 'app',
    1: 'id',
    2: 'value',
    3: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'value': i18n._("Value of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID for which you want to create the environment variable."),
    'mask' : i18n._("Mask the value of this Environment Variable"),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    fhc.env.read({app:params.app, id:params.id, env:params.env, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!data) {
        return cb(null, util.format(i18n._("Unable to find environment variable for app with id '%s' for the app '%s'"), params.id, params.app));
      }
      var url = "/box/api/apps/" + params.app + "/env/" + params.env + "/envvars/" + params.id;
      if ( params.mask ) {
        data.masked = true;
      }
      data.value = params.value;
      data.name = data.varName;
      common.doPutApiCall(fhreq.getFeedHenryUrl(), url, data, function(err, result) {
        if (err) {
          return cb(err);
        }
        if (!params.json) {
          params._table = common.createTableForAppEnvVars([result], params.env);
          return cb(null, params);
        } else {
          return cb(null, result);
        }
      });
    });
  }
};