var fhc = require("../../../../fhc");

module.exports = {
  'desc': 'Updates an environment variable witihin a deployment environment with a given env, name and id.',
  'examples': [
    {
      cmd: "fhc app envvars update --app=2b --env=dev --id=1a --name=someName --value=someValue2",
      desc: "updates an environment variable with id 1a in app 2b in the dev environment named someName with value someValue2"
    }
  ],
  'demand': ['app', 'env', 'name', 'id', 'value'],
  'alias': {
    'app': 'a',
    'env': 'e'
  },
  'describe': {
    'app' : 'Unique 24 character GUID of the app you want to retrieve env vars from',
    'env' : 'Environment to look up the env vars for',
    'name': 'The name, or key of your environment variable - this will be accessible by process.env.$NAME',
    'value': 'The value assigned to this env var',
    'id' : 'ID of the environment variable - see the guid property from the `list --deployed` command' 
  },
  'url' : function(argv){  
    return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars/" + argv.id;  
  },
  'method': 'PUT'
};
