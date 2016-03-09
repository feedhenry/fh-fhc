var _ = require('underscore'),
  ini = require('../../../utils/ini.js');
module.exports = {
  'desc' : 'Lists resources of a cloud app',
  'examples' : [
    { cmd : 'fhc app resources --app=1a --env=dev', desc : 'Shows the resources of the app with id 1a in the dev environment'}
  ],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    0 : 'app'
  },
  'describe' : {
    'app' : 'Unique 24 character GUID of the cloud app you want to see resource info for',
    'env' : 'The cloud environment your app is running in'
  },
  'preCmd' : function(params, cb) {
    this.app = params.app;
    params.domain = ini.get('domain', 'user');
    return cb(null, params);
  },
  'url' : function(argv){
    return "api/v2/resources"+ '/' + argv.domain + '/' + argv.env;
  },
  postCmd : function(params, cb){
    var apps = params.apps,
      app = _.findWhere(apps, {guid : this.app });
    if (!app){
      return cb('App with id ' + this.app + ' not found');
    }

    return cb(null, app);
  }
};
