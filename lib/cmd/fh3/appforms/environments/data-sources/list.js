var common = require('../../../../../common.js');

module.exports = {
  'desc' : 'List All Data Sources Deployed To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments data-sources list --environment="dev"', desc : 'List All Data Sources Deployed To An Environment'}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To List Data Sources"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/data_sources";
  },
  'method' : 'get',
  'postCmd': function(dataSources, cb){
    dataSources._table = common.createTableForEnvDataSources(dataSources);

    cb(undefined, dataSources);
  }

};
