/* globals i18n */
var common = require('../../../../../common.js');

module.exports = {
  'desc' : i18n._('Force a refresh of a single data source deployed to an environment'),
  'examples' : [{ cmd : 'fhc appforms environments data-sources refresh --environment="dev" --id="datasource1234"', desc : i18n._('Force a refresh of a single data source deployed to an environment')}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("ID of environment to refresh"),
    'id': i18n._("ID of the data source to refresh")
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
