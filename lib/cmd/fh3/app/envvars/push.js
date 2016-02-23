var fhc = require("../../../../fhc");

module.exports = {
  'desc' : 'Pushes staged environment variables to the specified environment',
  'examples' : [
    { cmd : 'fhc app envvars push --app=2b --env=dev', desc : 'Push env vars to the dev environment for app 2b'},
  ],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : 'Unique 24 character GUID of the app you want to push env vars to',
    'env' : 'Environment to push env vars to',
  },
  'url' : function(argv){
    return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars/push";  
  },
  'method' : 'post'
};
