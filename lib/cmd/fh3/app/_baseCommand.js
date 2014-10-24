var ini = require('../../../utils/ini.js');
module.exports = function(action){
  return { 
    'usage' : action + 's a cloud application. This command will only work if the app has previously been deployed',
    'examples' : [
      {cmd : 'fhc ' + action + ' --app=<appGuid> --env=<environmentName>', desc : ''}
    ],
    'demand' : ['a', 'e'],
    'alias' : {
      'a' : 'app',
      'e' : 'env'
    },
    'describe' : {
      'a' : 'Unieque 24 character GUID of your application',
      'e' : 'The lifecycle environment your application is running in, e.g. dev'
    },
    'url' : function(argv){
      var domain = ini.get("domain", "user");
      return '/' + action + 'app/' + domain + '/' + argv.env +'/' + argv.app;  
    },
    'preCmd' : function(argv, cb) {
      // No params actually needed - everything is provided in the URL
      return cb(null, {});
    },
    'postCmd' : function(params, cb) {
      console.log(params);
      console.log('in post cmd');
      return cb(null, params);
    }
  };
};
