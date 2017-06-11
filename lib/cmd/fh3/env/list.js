/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('List cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env list --app=<app> --env=<environment>',
      desc : "List cloud app environment variables from the <app> and <env>"
    }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'env',
    2: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    var url = "box/api/apps/" + params.app + "/env/" + params.env + "/envvars";
    common.doGetApiCall(fhreq.getFeedHenryUrl(), url, {}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data && data.length > 0) {
        params._table = common.createTableForAppEnvVars(data, params.env);
        return cb(null, params);
      } else {
        return cb(null, data);
      }
    });
  }
};