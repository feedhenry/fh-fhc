var common = require('../../../../common.js');

module.exports = {
  'desc': 'Create A New Data Source.',
  'examples': [{cmd: 'fhc appforms data-sources create --name="New Data Source" --description="A Data Source" --refreshInterval=2 --serviceGuid="glaovni73qwjla5qt2oyocw3" --endpoint="/path/to/data"', desc: 'Read A Single Data Source'}],
  'demand': ['name', 'serviceGuid', 'endpoint', 'refreshInterval', 'description'],
  'alias': {},
  'describe': {
    'name': "Name Of The Data Source To Create",
    'serviceGuid': "The ID Of The Service To Associate With The Data Source",
    'endpoint': "A Valid Path To The Endpoint To Be Polled For Data",
    'refreshInterval': "The Time, In Minutes, Between Data Polling",
    'description': "Description For The Data Source"
  },
  'url': "/api/v2/appforms/data_sources",
  'method': 'post',
  'postCmd': function(dataSource, cb){
    dataSource._table = common.createTableForDataSources(dataSource);
    cb(undefined, dataSource);
  }
};
