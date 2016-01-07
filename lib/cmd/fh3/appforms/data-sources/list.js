var common = require('../../../../common.js');

module.exports = {
  'desc': 'Lists All Data Sources.',
  'examples': [{cmd: 'fhc appforms data-sources list', desc: 'Lists All Data Sources.'}],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': "/api/v2/appforms/data_sources",
  'method': 'get',
  'postCmd': function(dataSources, cb){
    dataSources._table = common.createTableForDataSources(dataSources);
    cb(undefined, dataSources);
  }
};
