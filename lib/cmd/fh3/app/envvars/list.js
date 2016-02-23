var fhc = require("../../../../fhc");

module.exports = {
  'desc' : 'Gets the deployed environment variables for a cloud app in an environment.',
  'examples' : [
    { cmd : 'fhc app envvars list --app=2b --env=dev', desc : 'Lists all env vars for the 2b app in the dev environment'},
    { cmd : 'fhc app envvars list --app=2b --env=dev --deployed', desc : 'Lists the user-created and deployed env vars for the 2b app in the dev environment'}
  ],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : 'Unique 24 character GUID of the app you want to retrieve env vars from',
    'env' : 'Environment to look up the env vars for',
    'deployed' : 'Only list user created environment variables? These have typically already been deployed to an environment'
  },
  'url' : function(argv){
    if (argv.deployed){
      return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars";  
    }
    return "/api/v2/mbaas/" + fhc.config.get('domain') + "/" + argv.env + "/apps/" + fhc.appId(argv.app) + "/envvars";
  },
  'method' : 'get'
};
