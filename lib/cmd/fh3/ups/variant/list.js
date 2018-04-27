/* globals i18n */
var common = require('../../../../common.js');
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('List Push Notifications Variants for an app'),
  'examples' :
    [{
      cmd : 'fhc ups variant list --app=<appId>',
      desc : i18n._("List all UPS variants from the <appId>")
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
      var headers = ['VariantID', 'Name', 'Description', 'Secret', 'Developer', 'Production', 'Type'];
      var fields = ['variantID', 'name', 'description', 'secret', 'developer', 'production', 'type'];
      response._table = common.createTableFromArray(headers, fields, response.variants);
      return cb(null, response);
    }
    return cb(null, response.variants);
  }
};