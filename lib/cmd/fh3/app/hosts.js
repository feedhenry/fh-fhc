var fhc = require("../../../fhc");

module.exports = {
  'desc' : 'Gets the host for a cloud app in an environment.',
  'examples' : [{ cmd : 'fhc app hosts --app=2b --env=dev', desc : 'Gets the host for the 2b app in the dev environment'}],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : 'Unique 24 character GUID of the app you want to delete',
    'env' : 'Environment to look up the host for'
  },
  'url' : function(argv){
    return "/api/v2/mbaas/testing/" + argv.env + "/apps/" + fhc.appId(argv.app) + "/host";
  },
  'method' : 'get'
};
