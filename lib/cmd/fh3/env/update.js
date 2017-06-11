/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");

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
    'json': 'j',
    0: 'app',
    1: 'id',
    2: 'value',
    3: 'env',
    4: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'value': i18n._("Value of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    params.env = params.env || 'dev';
    fhc.env.read({app:params.app, id:params.id, env:params.env, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      var url = "/box/api/apps/" + params.app + "/env/" + params.env + "/envvars/" + params.id;
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