/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Unset cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env unset --app=<app> --id=<id> --env=<environment>',
      desc : "Unset cloud app environment variables from the <app> and <env>"
    }],
  'demand' : ['app','id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'id',
    2: 'env',
    3: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    var playload = {appId: params.app, envVarId: params.id};
    if (params.env === "dev") {
      playload.devValue = true;
    }
    if (params.env === "live") {
      playload.liveValue = true;
    }
    var url= "box/srv/1.1/app/envvariable/unset";
    return common.doApiCall(fhreq.getFeedHenryUrl(), url, playload, i18n._("Error unseting env var: "), function(err,data) {
      if (err) {
        cb(err);
      }
      if (!params.json) {
        return cb(null, util.format(i18n._("Environment variables from the app '%' with the id '%s' into the env '%s' unsettled successfully."), params.app, params.id, params.env));
      } else {
        return cb(null, data);
      }
    });
  }
};