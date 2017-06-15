/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Set override value for secure endpoint'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints set-override --app=<app-id> --endpoint=<endpoint> --security=<security> --env=<environment>',
      desc : i18n._('Set <endpoint> and <security> value override for secure endpoint from <app> into <environment>')
    }],
  'demand' : ['app','endpoint','security','env'],
  'alias' : {
    'app' : 'a',
    'endpoint' : 'end',
    'security' : 's',
    'env' : 'e',
    0 : 'app',
    1 : 'endpoint',
    2 : 'security',
    3 : 'env'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the application'),
    'endpoint' : i18n._('Endpoint that you want override'),
    'security' : i18n._("Security value where 'default' can be either 'https' or 'appapikey'"),
    'env' : i18n._("The environment where the app is deployed")
  },
  'customCmd' : function(params,cb) {
    if (params.security !== 'https' && params.security !== 'appapikey') {
      return cb(i18n._("'security' must be 'https' or 'appapikey': "));
    }
    var payload = {appId: params.app, environment: params.env};
    payload.overrides = {};
    payload.overrides[params.endpoint] = {
      security: params.security
    };
    return common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/setOverride",
      payload, i18n._("Error overriding secureendpoint: "), cb);
  }
};

