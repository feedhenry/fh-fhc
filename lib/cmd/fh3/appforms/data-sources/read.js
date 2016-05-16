/* globals i18n */
var common = require('../../../../common.js');

module.exports = {
  'desc': i18n._('Read a single data source.'),
  'examples': [{cmd: 'fhc appforms data-sources read --id=<ID Of Data Source To Read>', desc: i18n._('Read a single data source')}],
  'demand': ['id'],
  'alias': {},
  'describe': {
    'id': i18n._("ID of the data source to read")
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
