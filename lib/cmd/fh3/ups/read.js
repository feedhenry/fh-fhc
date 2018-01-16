/* globals i18n */
var common = require('../../../common.js');
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Read the Push Notification for an app'),
  'examples' :
    [{
      cmd : 'fhc ups read --app=<appId>',
      desc : i18n._("Read the Push Notification from the <appId>")
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
  'preCmd': function(params, cb) {
    fhc.ups.config({app:params.app, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!data || !data.pushApplicationID) {
        return cb(i18n._("Not found Push Notification"));
      }
      params.pushApplicationID = data.pushApplicationID;
      return cb(null, params);
    });
  },
  'url': function(params) {
    return "/api/v2/ag-push/rest/applications/" + params.pushApplicationID;
  },
  'method': 'get',
  'postCmd': function(params, response, cb) {

    if (!params.json) {
      var qtVariants = response.variants.length;
      response.variants = qtVariants;
      response._table = common.createObjectTable(response);
      return cb(null, response);
    }
    return cb(null, response);
  }
};