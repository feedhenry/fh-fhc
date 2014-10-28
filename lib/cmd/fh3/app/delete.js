var fhc = require("../../../fhc");

module.exports = { 
  'desc' : 'Deletes an app under a project.',
  'examples' : [{ cmd : 'fhc app delete --project=1a --app=2b', desc : 'Deletes app with id 2b under project with id 1a'}],
  'demand' : ['p', 'a'],
  'alias' : {
    'p' : 'project',
    'a' : 'app'
  },
  'describe' : {
    'p' : 'Unique 24 character GUID of the project your app lives in',
    'a' : 'Unique 24 character GUID of the app you want to delete',
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project + "/apps/" + fhc.appId(argv.app)
  },
  'method' : 'delete'
};
