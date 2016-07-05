/* globals i18n */
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Gets the host for a cloud app in an environment.'),
  'examples' : [{ cmd : 'fhc app hosts --app=2b --env=dev', desc : i18n._('Gets the host for the 2b app in the dev environment')}],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the app you want to delete'),
    'env' : i18n._('Environment to look up the host for')
  },
  'url' : function(argv){
    return "/api/v2/mbaas/" + fhc.config.get('domain') + "/" + argv.env + "/apps/" + fhc.appId(argv.app) + "/host";
  },
  'method' : 'get'
};
