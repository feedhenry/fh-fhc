/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Create cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env create --app=<app> --name=<name> --env=<environment>',
      desc : "Create a cloud app environment variables for the <app> in the <env> with the <name> and <value>"
    }],
  'demand' : ['app', 'name'],
  'alias' : {
    'app': 'a',
    'name': 'n',
    'value': 'v',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'name',
    2: 'value',
    3: 'env',
    4: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'name': i18n._("Name of the environment variable."),
    'value': i18n._("Value of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    var url ="box/srv/1.1/app/envvariable/create";
    var payload = {appId: params.app, name: params.name};
    if (params.env === 'live') {
      payload.liveValue = params.value;
    } else if (params.env === 'dev') {
      payload.devValue =  params.value;
    }
    return common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error creating env var: "), function(err,data) {
      if (err) {
        cb(err);
      }
      if (!params.json) {
        return cb(null, util.format(i18n._("Environment variables from the app '%' with the name '%s' and value '%s' for the env '%s' created successfully."), params.app, params.name, params.value, params.env));
      } else {
        return cb(null, data);
      }
    });
  }
};