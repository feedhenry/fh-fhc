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
      desc : "Update the cloud app environment variables with the <id> from the <app> in the <env> with the <name> and <value>"
    }],
  'demand' : ['app', 'id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'value': 'v',
    'env': 'e',
    0: 'app',
    1: 'id',
    2: 'value',
    3: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'value': i18n._("Value of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'customCmd' : function(params,cb) {
    fhc.env.read({app:params.app, id:params.id}, cb, function(err,data) {
      if (err) {
        return cb(err);
      }
      params.env = params.env || 'dev';
      var url = "box/srv/1.1/app/envvariable/update";
      if (params.env === 'dev') {
        data.devValue = params.value;
      } else if (params.env === 'live') {
        data.liveValue = params.value;
      }
      return common.doApiCall(fhreq.getFeedHenryUrl(), url, data, i18n._("Error updating env var: "), function(err,data) {
        if (err) {
          cb(err);
        }
        if (!params.json) {
          return cb(null, util.format(i18n._("Environment variables from the app '%s' whith the id '%s' update successfully with the value '%s' into the env '%s'."), params.app, params.id, params.value, params.env));
        } else {
          return cb(null, data);
        }
      });
    });

  }
};