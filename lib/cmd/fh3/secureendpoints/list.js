/* globals i18n */
var common = require("../../../common");
var Table = require('cli-table');
var _ = require('underscore');
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('List secure endpoints overrides'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints list --app=<app-id> --env=<environment>',
      desc : i18n._('List all secure endpoints overrides from <app> into <environment>')
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
        if (data.overrides) {
          data._message = data.message + i18n._("\nEndpoint Overrides:");
          data._table = createTableForOverrides(data.overrides);
        }
      }
      return cb(null, data);
    });

  }
};

function createTableForOverrides(overrides) {
  var table = new Table({
    head: ['Endpoint', 'Security', 'Updated By', 'Updated When'],
    style: common.style()
  });
  _.each(overrides, function(entry, endpoint) {
    table.push([endpoint, entry.security, entry.updatedBy, entry.updatedWhen]);
  });
  return table;
}