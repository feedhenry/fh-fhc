/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Create cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env create --app=<app> --name=<name> --value=<value> --env=<environment>',
      desc : i18n._("Create a cloud app environment variables for the <app> in the <env> with the <name> and <value>")
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
    'env': i18n._("Default value is dev. Environment ID for which you want to create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params, cb) {
    var environment = params.env || 'dev';
    var url = "/box/api/apps/" + params.app + "/env/" + environment + "/envvars";
    var playload = { masked: "false", name: params.name, value: params.value};
    return common.doApiCall(fhreq.getFeedHenryUrl(), url, playload, i18n._("Error creating env var: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        return cb(null, util.format(i18n._("Successfully created Environment variable for the app '%s' in the '%s' Environment: '%s=%s'."),params.app, environment, params.name, params.value));
      } else {
        return cb(null, data);
      }
    });
  }
};