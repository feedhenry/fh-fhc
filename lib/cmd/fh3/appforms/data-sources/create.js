var common = require('../../../../common.js');

module.exports = {
  'desc': 'Create a new data source.',
  'examples': [{cmd: 'fhc appforms data-sources create --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data" --numAuditLogEntries 20', desc: 'Read a single data source'}],
  'demand': ['name', 'serviceGuid', 'endpoint', 'refreshInterval', 'description', 'numAuditLogEntries'],
  'alias': {},
  'describe': {
    'name': "Name of the data source to create",
    'serviceGuid': "The ID of the service to associate with the data source",
    'endpoint': "A valid path to the endpoint to be polled for data",
    'refreshInterval': "The time, in minutes, between data polling",
    'description': "Description for the data source",
    'numAuditLogEntries': "Number of Audit Log entries to store"
  },
  'url': "/api/v2/appforms/data_sources",
  'method': 'post',
  'postCmd': function(dataSource, cb){
    dataSource._table = common.createTableForDataSources(dataSource);
    cb(undefined, dataSource);
  }
};
