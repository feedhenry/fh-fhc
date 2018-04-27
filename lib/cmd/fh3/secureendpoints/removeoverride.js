/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Remove override value from secure endpoint'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints  remove-override --app=<app-id> --endpoint=<endpoint> --env=<environment>',
      desc : i18n._('Remove override from <endpoint> and <app> into <environment>')
    }],
  'demand' : ['app','endpoint','env'],
  'alias' : {
    'app' : 'a',
    'endpoint' : 'end',
    'env' : 'e',
    0 : 'app',
    1 : 'endpoint',
    2 : 'env'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the application'),
    'endpoint' : i18n._('Endpoint that you want override'),
    'env' : i18n._("The environment where the app is deployed")
  },
  'customCmd' : function(params,cb) {
    var payload = {appId: params.app, environment: params.env, endpoint: params.endpoint};
    return common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/removeOverride",
      payload, i18n._("Error removing override: "), cb);
  }
};

