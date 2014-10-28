var ini = require('../../../utils/ini.js');
module.exports = { 
  'desc' : 'Creates an application.',
  'examples' : [
    {cmd : "fhc app create --project=<project-id> --title=<title> [--type=<appType>]", desc : "" }
  ],
  'demand' : ['p', 't'],
  'alias' : {
    'p' : 'project',
    't' : 'title',
    'y' : 'type'
  },
  'describe' : {
    'p' : 'Unique 24 character GUID of the project you want this app to be created in',
    't' : 'A title for your app',
    'y' : 'Type of your app - e.g. client_hybrid, client_native_ios, client_native_android, cloud_nodejs'
  },
  'defaults' : {
    'type' : 'client_hybrid'
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project + "/apps"
  },
  'preCmd' : function(argv, cb) {
    return cb(null, {
      title: argv.title,
      template: {"type" : argv.type || 'client_hybrid'}
    });
  }
};
