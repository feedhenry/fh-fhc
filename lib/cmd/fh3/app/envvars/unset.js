var fhc = require("../../../../fhc");

module.exports = {
  'desc': 'Unsets an environment variable witihin a deployment environment inside a cloud application.',
  'examples': [
    {
      cmd: "fhc app envvars unset --app=2b --env=dev --id=3c",
      desc: "Unsets environment variable with id 3c in app with id 2b in environment dev"
    }
  ],
  'demand': ['app', 'env', 'id'],
  'alias': {
    'app': 'a',
    'env': 'e'
  },
  'describe': {
    'app' : 'Unique 24 character GUID of the app you want to unset the env var in',
    'env' : 'Environment to unset env var in',
    'id' : 'ID of the environment variable - see the guid property from the `list --deployed` command'
  },
  'url' : function(argv){  
    return "/box/api/apps/" + fhc.appId(argv.app) + "/env/" + argv.env + "/envvars/unset";  
  },
  preCmd : function(params, cb){
    var payload = [params.id];
    payload.id = params.id;
    payload.app = params.app;
    payload.env = params.env;
    // payload is an array of IDs to unset..
    return cb(null, payload);
  },
  'method': 'put'
};
