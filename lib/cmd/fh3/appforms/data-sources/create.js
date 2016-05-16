/* globals i18n */
var common = require('../../../../common.js');

module.exports = {
  'desc': i18n._('Create a new data source.'),
  'examples': [{cmd: 'fhc appforms data-sources create --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data" --numAuditLogEntries 20', desc: i18n._('Read a single data source')}],
  'demand': ['name', 'serviceGuid', 'endpoint', 'refreshInterval', 'description', 'numAuditLogEntries'],
  'alias': {},
  'describe': {
    'name': i18n._("Name of the data source to create"),
    'serviceGuid': i18n._("The ID of the service to associate with the data source"),
    'endpoint': i18n._("A valid path to the endpoint to be polled for data"),
    'refreshInterval': i18n._("The time, in minutes, between data polling"),
    'description': i18n._("Description for the data source"),
    'numAuditLogEntries': i18n._("Number of Audit Log entries to store")
  },
  'url': "/api/v2/appforms/data_sources",
  'method': 'post',
  'postCmd': function(dataSource, cb){
    dataSource._table = common.createTableForDataSources(dataSource);
    cb(undefined, dataSource);
  }
};
