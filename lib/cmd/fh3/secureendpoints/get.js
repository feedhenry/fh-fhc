/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Get App Security from Secure Endpoint'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints get --app=<app-id> --env=<environment>',
      desc : i18n._('Get App Security from Secure Endpoint from <app> into <environment>')
    }],
  'demand' : ['app','env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    'json' : 'j',
    0 : 'app',
    1 : 'env',
    2 : 'json'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the application'),
    'env' : i18n._('The environment where the app is deployed'),
    'json' : i18n._('Output into json format')
  },
  'customCmd' : function(params,cb) {
    var payload = {appId: params.app, environment: params.env};
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/get", payload, i18n._("Error getting secure endpoints: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        if ( data.default ) {
          return cb(null,i18n._("App Security: ") + data.default);
        } else {
          return cb(null,i18n._("Not found app Security. "));
        }
      }
      return cb(null, data);
    });

  }
};