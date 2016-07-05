/* globals i18n */
var common = require('../../../../../common.js');
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Read a single data source, including Audit Logs deployed to an environment.'),
  'examples' : [{ cmd : 'fhc appforms environments data-sources audit-logs --environment="dev" --id="datasource1234" --limit 20', desc : i18n._('Read a single data source, including Audit Logs deployed to an environment.')}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("ID of environment to read data source data from"),
    'id': i18n._("ID of the data source to read"),
    'limit': i18n._("Limit the number of results displayed")
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources/" + params.id + "/audit_logs";
  },
  'method' : 'get',
  'preCmd': function(params, cb){
    this.limit = params.limit;
    cb(undefined, params);
  },
  'postCmd': function(dataSourceWithAuditLogs, cb){
    var now = new Date();

    //Sorting By The Time The Data Source Was Updated
    dataSourceWithAuditLogs.auditLogs = _.sortBy(dataSourceWithAuditLogs.auditLogs || [], function(auditLogEntry){
      return (now - new Date(auditLogEntry.updateTimestamp));
    });

    dataSourceWithAuditLogs._table = common.createTableForEnvDataSourcesAuditLogs(dataSourceWithAuditLogs, {
      limit: this.limit
    });

    cb(undefined, dataSourceWithAuditLogs);
  }
};
