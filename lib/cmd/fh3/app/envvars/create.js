var fhc = require("../../../../fhc");

module.exports = {
  'desc': 'Creates an environment variable witihin a deployment environment with a given env and name.',
  'examples': [
    {
      cmd: "fhc app envvars create --app=2b --env=dev --name=FOO --value=BAR",
      desc: "Creates an environment variable for app 2b in the dev environment with name FOO and value BAR"
    }
  ],
  'demand': ['app', 'env', 'name'],
  'alias': {
    'app': 'a',
    'env': 'e'
  },
  'describe': {
    'app' : 'Unique 24 character GUID of the app you want to retrieve env vars from',
    'env' : 'Environment to look up the env vars for',
    'name': 'The name, or key of your environment variable - this will be accessible by process.env.$NAME',
    'value': 'The value assigned to this env var'
  },
  'url' : function(argv){  
    return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars";  
  },
  'method': 'post'
};
