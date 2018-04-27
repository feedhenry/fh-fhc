/* globals i18n */
var common = require('../../../common.js');

module.exports = {
  'desc' : i18n._('Read Push Notifications init config for an app'),
  'examples' :
  [{
    cmd : 'fhc ups config --app=<appId>',
    desc : i18n._("Read UPS init config from the <appId>")
  }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    'json': 'j',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'json' : i18n._("Output in json format")
  },
  'url': function(params) {
    return '/api/v2/ag-push/init/' + params.app;
  },
  'method': 'get',
  'postCmd': function(params, response, cb) {
    if (!response || !response.pushApplicationID) {
      return cb(i18n._("Push notification not found."));
    }
    if (!params.json) {
      response._table = common.createNVTable(response);
      return cb(null, response);
    }
    return cb(null, response);
  }
};
