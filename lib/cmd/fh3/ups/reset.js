/* globals i18n */
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Reset Push Notifications Secret for an app'),
  'examples' :
    [{
      cmd : 'fhc ups reset --app=<appId>',
      desc : i18n._("Reset the Master Secret Push Notifications Secret from the <appId>")
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
    return "/api/v2/ag-push/rest/applications/" + params.pushApplicationID + "/reset";
  },
  'method': 'put',
  'postCmd': function(params, response, cb) {
    if (!params.json) {
      return cb(null, i18n._("Master Secrete reset/re-newed successfully."));
    }
    return cb(null, response);
  }
};