/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Read cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env read --app=<app> --id=<id> --value=<value> --env=<environment>',
      desc : "Read a cloud app environment variables with the <id> from the <app> into the <env>"
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
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'customCmd' : function(params,cb) {
    var playload = {appId: params.app, envVarId: params.id, env: params.env || 'dev'};
    var url = "box/srv/1.1/app/envvariable/read";
    return common.doApiCall(fhreq.getFeedHenryUrl(), url , playload, i18n._("Error reading env vars:"), cb);
  }
};