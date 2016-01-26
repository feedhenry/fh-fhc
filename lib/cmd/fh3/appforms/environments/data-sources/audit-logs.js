var common = require('../../../../../common.js');
var _ = require('underscore');

module.exports = {
  'desc' : 'Read a single data source, including Audit Logs deployed to an environment.',
  'examples' : [{ cmd : 'fhc appforms environments data-sources audit-logs --environment="dev" --id="datasource1234"', desc : 'Read a single data source, including Audit Logs deployed to an environment.'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': "ID of environment to read data source data from",
    'id': "ID of the data source to read"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources/" + params.id + "/audit_logs";
  },
  'method' : 'get',
  'postCmd': function(dataSourceWithAuditLogs, cb){

    var now = new Date();

    //Sorting By The Time The Data Source Was Updated
    dataSourceWithAuditLogs.auditLogs = _.sortBy(dataSourceWithAuditLogs.auditLogs || [], function(auditLogEntry){
      return (now - new Date(auditLogEntry.updateTimestamp));
    });

    dataSourceWithAuditLogs._table = common.createTableForEnvDataSourcesAuditLogs(dataSourceWithAuditLogs);

    cb(undefined, dataSourceWithAuditLogs);
  }
};
