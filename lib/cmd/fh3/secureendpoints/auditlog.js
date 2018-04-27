/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");
var Table = require('cli-table');
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Audit logs from secure endpoints'),
  'examples' :
    [{
      cmd : 'fhc secureendpoints auditlog --app=<app-id> --env=<environment>',
      desc : i18n._('List all audit logs from a secure endpoints from <app> into <environment>')
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
    'env' : i18n._("The environment where the app is deployed"),
    'json' : i18n._('Output into json format')
  },
  'customCmd' : function(params,cb) {
    var payload = {appId: params.app, environment: params.env};
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/app/endpointsecurity/auditLog", payload, i18n._("Error getting auditlog: "), function(err, log) {
      if (err) {
        return cb(err);
      }

      if (!params.json) {
        log._table = createTableForAuditLog(log.list);
      }
      return cb(null, log);
    });
  }
};

/**
 * Create a table out put for audit logs
 * @param entries
 * @returns {Table}
 */
function createTableForAuditLog(entries) {
  var table = new Table({
    head: ['Event', 'Endpoint', 'Security', 'Updated By', 'Updated When'],
    style: common.style()
  });

  _.each(entries, function(entry) {
    table.push([entry.event, entry.endpoint, entry.security, entry.updatedBy, entry.updatedWhen]);
  });
  return table;
}

