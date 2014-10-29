var ini = require('../../../utils/ini.js');
module.exports = { 
  'desc' : 'Creates an application.',
  'examples' : [
    {cmd : "fhc app create --project=1a2b3c --title=My New App --type=cloud_nodejs", desc : "Creates a new hybrid app" }
  ],
  'demand' : ['project'],
  'alias' : {
    0 : 'project',
    'project' : 'p',
    'title' : 't',
    'type' : 'y'
  },
  'describe' : {
    'project' : 'Unique 24 character GUID of the project you want this app to be created in',
    'title' : 'A title for your app',
    'type' : 'Type of your app - e.g. client_hybrid, client_native_ios, client_native_android, cloud_nodejs'
  },
  'defaults' : {
    'type' : 'client_hybrid'
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project + "/apps"
  },
  'method' : 'post',
  'preCmd' : function(argv, cb) {
    return cb(null, {
      title: argv.title,
      project : argv.project,
      template: {"type" : argv.type || 'client_hybrid'}
    });
  }
};
