/* globals i18n */
var common = require('../../../../../common.js');
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Validate a data source definition against an environment. this will validate that the service is deployed and the data set is valid.'),
  'examples': [{cmd: 'fhc appforms data-sources validate --environment="dev" --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data"', desc: i18n._('Validate a data source definition against an environment')}],
  'demand': ['name', 'serviceGuid', 'endpoint', 'environment', 'refreshInterval', 'description'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID of environment to refresh"),
    'name': i18n._("Name of the data source to validate"),
    'serviceGuid': i18n._("The ID of the service to associate with the data source"),
    'endpoint': i18n._("A valid path to the endpoint to be polled for data"),
    'refreshInterval': i18n._("The time, in minutes, between data polling"),
    'description': i18n._("Description for the data source")
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources/validate";
  },
  'method': 'post',
  'postCmd': function(dataSources, cb){
    dataSources._table = common.createTableForEnvDataSourcesValidation(dataSources);

    cb(undefined, dataSources);
  }
};
