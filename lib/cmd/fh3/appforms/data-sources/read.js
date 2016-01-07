var common = require('../../../../common.js');

module.exports = {
  'desc': 'Read A Single Data Source.',
  'examples': [{cmd: 'fhc appforms data-sources read --id=<ID Of Data Source To Read>', desc: 'Read A Single Data Source'}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': "ID Of The Data Source To Read"
  },
  'url': function (params) {
    return "/api/v2/appforms/data_sources/" + params.id;
  },
  'method': 'get',
  'postCmd': function(dataSource, cb){
    dataSource._table = common.createTableForDataSources(dataSource);
    cb(undefined, dataSource);
  }
};
