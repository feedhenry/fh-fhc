/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");


module.exports = {
  'desc' : i18n._('Set default value for secure endpoints'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints set-default --app=<app-id> --default=<default> --env=<environment>',
      desc : i18n._('Set <default> secure endpoint for <app> into <environment>')
    }],
  'demand' : ['app','default','env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    'default' : 'd',
    'json' : 'j',
    0 : 'app',
    1 : 'env',
    2 : 'default'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the application'),
    'env' : i18n._('The environment where the app is deployed'),
    'default' : i18n._("where 'default' can be either 'https' or 'appapikey'")
  },
  'customCmd' : function(params,cb) {
    if (params.default !== 'https' && params.default !== 'appapikey') {
      return cb(i18n._("'default' must be 'https' or 'appapikey': "));
    }
    var payload = {appId: params.app, environment: params.env, default:params.default};
    return common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setDefault",
      payload, i18n._("Error setting default secureendpoint: "), cb);
  }
};

