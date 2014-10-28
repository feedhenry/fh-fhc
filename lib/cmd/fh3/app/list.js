var common = require('../../../common.js');
module.exports = { 
  'usage' : 'Lists apps under a project.',
  'examples' : [{ cmd : 'fhc app list --project=1a2b3c', desc : 'Lists applications under project with id 1a2b3c'}],
  'demand' : ['project'],
  'alias' : {
    'project' : 'p'
  },
  'describe' : {
    'project' : 'Unique 24 character GUID of the project you want to list apps in',
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project
  },
  'method' : 'get',
  'postCmd' : function(params, cb) {
    params._table = common.createTableForProjectApps(params.guid, params.apps);
    return cb(null, params);
  }
};
