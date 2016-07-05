/* globals i18n */
var common = require('../../../../../common.js');

module.exports = {
  'desc' : i18n._('Read a single data source deployed to an environment'),
  'examples' : [{ cmd : 'fhc appforms environments data-sources read --environment="dev" --id="datasource1234"', desc : i18n._('Read a single data source deployed to an environment')}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("ID of environment to read data source data from"),
    'id': i18n._("ID of the data source to read")
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
