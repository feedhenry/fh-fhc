var fhc = require("../../../fhc");
module.exports = { 
  'desc' : 'Provides the endpoints for the specified app in the specified environment.',
  'examples' : [
    {
      cmd : 'fhc app endpoints --app=1a2b --env=dev',
      desc : 'Lists all endpoints exposed by app with guid 1a2b in the dev environment'
    }
  ],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    'env' : 'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : 'Unieque 24 character GUID of your application',
    'env' : 'The lifecycle environment your application is running in, e.g. dev'
  },
  'url' : function(argv){
    return "api/v2/app/" + fhc.curTarget + "/endpoints";
  },
  'preCmd' : function(params, cb) {
    return cb(null, { appName : params.app, dynoName : params.env });
  },
};
  
