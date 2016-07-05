/* globals i18n */
var _ = require('underscore'),
  ini = require('../../../utils/ini.js'),
  util = require('util');

module.exports = {
  'desc' : i18n._('Lists resources of a cloud app'),
  'examples' : [
    { cmd : 'fhc app resources --app=1a --env=dev', desc : i18n._('Shows the resources of the app with id 1a in the dev environment')}
  ],
  'demand' : ['app', 'env'],
  'alias' : {
    'app' : 'a',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the cloud app you want to see resource info for'),
    'env' : i18n._('The cloud environment your app is running in')
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
      return cb(util.format(i18n._('App with id %s not found'), this.app));
    }

    return cb(null, app);
  }
};
