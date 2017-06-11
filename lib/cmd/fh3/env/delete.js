/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Deleate cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env delete --app=<app> --id=<id> --env=<environment>',
      desc : "Delete the cloud app environment variables with the <id> from the <app> in the <env>"
    }],
  'demand' : ['app', 'id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'env': 'e',
    0: 'app',
    1: 'id',
    3: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'customCmd' : function(params,cb) {
    var url = "box/srv/1.1/app/envvariable/delete";
    var playload = {appId: params.app, envVarId: params.id, env: params.env || 'dev'};
    return common.doApiCall(fhreq.getFeedHenryUrl(), url, playload, i18n._("Error delete env var: "), function(err,data) {
      if (err) {
        cb(err);
      }
      if (!params.json) {
        return cb(null, util.format(i18n._("Environment variables from the app '%s' with the id '%s' into the env '%s' deleted successfully"), params.app, params.id, params.env));
      } else {
        return cb(null, data);
      }
    });
  }
};