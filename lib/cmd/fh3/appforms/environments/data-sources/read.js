var common = require('../../../../../common.js');

module.exports = {
  'desc' : 'Read A Single Data Source Deployed To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments data-sources read --environment="dev" --id="datasource1234"', desc : 'Read A Single Data Source Deployed To An Environment'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To Read Data Source Data From",
    'id': "ID Of The Data Source To Read"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources/" + params.id;
  },
  'method' : 'get',
  'postCmd': function(dataSources, cb){
    dataSources._table = common.createTableForEnvDataSources(dataSources);

    cb(undefined, dataSources);
  }
};
