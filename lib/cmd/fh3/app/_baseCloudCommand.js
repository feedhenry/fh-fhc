/* globals i18n */
var ini = require('../../../utils/ini.js');
module.exports = function(action){
  return {
    'desc' : action + 's a cloud application. This command will only work if the app has previously been deployed',
    'examples' : [
      {cmd : 'fhc app ' + action + ' --app=<appGuid> --env=<environmentName>', desc : ''}
    ],
    'demand' : ['app', 'env'],
    'alias' : {
      'app' : 'a',
      'env' : 'e',
      0 : 'app',
      1 : 'env'
    },
    'describe' : {
      'app' : i18n._('Unique 24-character GUID of your application'),
      'env' : i18n._('The lifecycle environment your application is running in, e.g. dev')
    },
    'method' : 'post',
    'url' : function(argv){
      var domain = ini.get("domain", "user");
      return '/api/v2/mbaas/' + domain + '/' + argv.env +'/apps/' + argv.app + '/' + action;
    }
  };
};
