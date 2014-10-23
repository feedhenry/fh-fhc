module.exports = { 
  'usage' : 'Starts a cloud application. This command will only work if the app has previously been deployed.',
  'example' : 'fhc start --app=<appGuid> --env=<environmentName>',
  'demand' : ['a', 'e'],
  'alias' : {
    'a' : 'app',
    'e' : 'env'
  },
  'describe' : {
    'a' : 'Unieque 24 character GUID of your application',
    'e' : 'The lifecycle environment your application is running in, e.g. dev'
  },
  'table' : {
    'tableColumn' : 'responseField'
  },
  'url' : function(argv){
    return '/startapp/:domain/:env/:guid';  
  },
  'preCmd' : function(argv, cb) {
    return cb(null, { appName : argv.app, dynoName : argv.env });
  },
  'customCmd' : function(params, cb) {
    var common = require('../../common');
    return common.doApiCall(fhreq.getFeedHenryUrl(), url, params, "Error getting app endpoints: ", cb)
  },
  'postCmd' : function(params, cb) {
    console.log(params);
    console.log('in post cmd');
    return cb(null, params);
  }
};
  
