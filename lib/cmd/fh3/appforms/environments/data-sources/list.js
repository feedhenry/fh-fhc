/* globals i18n */
var common = require('../../../../../common.js');

module.exports = {
  'desc' : i18n._('List all data sources deployed to an environment'),
  'examples' : [{ cmd : 'fhc appforms environments data-sources list --environment="dev"', desc : i18n._('List all data sources deployed to an environment')}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("ID of environment to list data sources")
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
