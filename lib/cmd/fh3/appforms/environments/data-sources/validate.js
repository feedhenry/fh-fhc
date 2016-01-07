var common = require('../../../../../common.js');
var _ = require('underscore');

module.exports = {
  'desc': 'Validate A Data Source Definition Against An Environment. This Will Validate That The Service Is Deployed And The Data Set Is Valid.',
  'examples': [{cmd: 'fhc appforms data-sources validate --environment="dev" --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data"', desc: 'Validate A Data Source Definition Against An Environment'}],
  'demand': ['name', 'serviceGuid', 'endpoint', 'environment', 'refreshInterval', 'description'],
  'alias': {},
  'describe': {
    'environment': "ID Of Environment To Refresh",
    'name': "Name Of The Data Source To Validate",
    'serviceGuid': "The ID Of The Service To Associate With The Data Source",
    'endpoint': "A Valid Path To The Endpoint To Be Polled For Data",
    'refreshInterval': "The Time, In Minutes, Between Data Polling",
    'description': "Description For The Data Source"
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
