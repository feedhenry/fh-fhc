/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Delete Push Notifications Variant for an app'),
  'examples' :
    [{
      cmd : 'fhc ups variant delete --app=<appId> --id=<id>',
      desc : i18n._("Delete the variant with <id> from the <appId>")
    }],
  'demand' : ['app','id','type'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'type': 't',
    'json': 'j',
    0 : 'app',
    1 : 'id',
    2 : 'type'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'id' : i18n._("Variant ID which should be removed. To get this value use $fhc ups variant list --app=<app>"),
    'type' : i18n._("Type of the variant. Choose from: \n\t\t - android \n\t\t - ios \n\t\t - windows (WNS)\n "),
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
    return "/api/v2/ag-push/rest/applications/" + params.pushApplicationID + "/" + params.type + "/" + params.id;
  },
  'method': 'delete',
  'postCmd': function(params, response, cb) {
    if (!params.json) {
      return cb(null, i18n._("Variant deleted successfully."));
    }
    return cb(null, response);
  }
};