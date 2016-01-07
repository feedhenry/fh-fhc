var common = require('../../../../common.js');

module.exports = {
  'desc': 'Read a single data source.',
  'examples': [{cmd: 'fhc appforms data-sources read --id=<ID Of Data Source To Read>', desc: 'Read a single data source'}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': "ID of the data source to read"
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
