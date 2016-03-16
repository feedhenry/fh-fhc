var fhc = require("../../../../fhc");

module.exports = {
  'desc': 'Deletes an environment variable witihin a deployment environment inside a cloud application.',
  'examples': [
    {
      cmd: "fhc app envvars delete --app=2b --env=dev --id=3c",
      desc: "Deletes an environment variable for app 2b in the dev environment with id 3c"
    }
  ],
  'demand': ['app', 'env', 'id'],
  'alias': {
    'app': 'a',
    'env': 'e'
  },
  'describe': {
    'app' : 'Unique 24 character GUID of the app you want to delete the env var in',
    'env' : 'Environment to delete the env var in',
    'id' : 'ID of the environment variable - see the guid property from the `list --deployed` command'
  },
  'url' : function(argv){  
    return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars/" + argv.id;  
  },
  'method': 'delete'
};
