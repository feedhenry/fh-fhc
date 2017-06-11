/* globals i18n */
var common = require('../../../common.js');
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('List notifications of a RHMAP App'),
  'examples' : [{
    cmd : 'fhc notifications list --app=<app> --env=<environment>',
    desc : i18n._('List notifications of the <app>')}],
  'demand' : ['app', 'env'],
  'alias' : {
    'app':'a',
    'env':'e',
    'audit':'au',
    'json': 'j',
    0 : 'app',
    1 : 'env',
    2 : 'audit',
    3 : 'json'
  },
  'describe' : {
    'app'   : i18n._("Unique 24 character GUID of your cloud application."),
    'env'   : i18n._("Unique 24 character GUID of the environment where this cloud application is deployed."),
    'audit' : i18n._("To inform the use of the audit parameter to list the notifications"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var uri = "box/srv/1.1/app/eventlog/listEvents";
    var payload = {appGuid: params.app, eventGroup: "NOTIFICATION", env: params.env};
    if (params.audit) {
      payload.audit = true;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error getting event logs for app: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        if (data && data.list && data.list.length > 0) {
          params._table = common.createTableForNotifications(data.list);
          return cb(null, params);
        } else {
          return cb(util.format(i18n._("Not found notifications for the app '%s' into the env '%s'."), params.app, params.env));
        }
      } else {
        return cb(null, data.list || data);
      }
    });
  }
};