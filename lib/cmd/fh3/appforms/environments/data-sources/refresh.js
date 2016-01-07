var common = require('../../../../../common.js');

module.exports = {
  'desc' : 'Force A Refresh Of A Single Data Source Deployed To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments data-sources refresh --environment="dev" --id="datasource1234"', desc : 'Force A Refresh Of A Single Data Source Deployed To An Environment'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To Refresh",
    'id': "ID Of The Data Source To Refresh"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources/" + params.id + "/refresh";
  },
  'method' : 'post',
  'postCmd': function(dataSources, cb){
    dataSources._table = common.createTableForEnvDataSources(dataSources);

    cb(undefined, dataSources);
  }
};
