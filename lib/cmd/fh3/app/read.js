var fhc = require("../../../fhc");

module.exports = { 
  'desc' : 'Reads an app under a project.',
  'examples' : [{ cmd : 'fh app read --project=1a --app=2b', desc : 'Reads app with id 2b under project with id 1a'}],
  'demand' : ['project', 'app'],
  'alias' : {
    'project' : 'p',
    'app' : 'a',
    0 : 'project',
    1 : 'app'
  },
  'describe' : {
    'project' : 'Unique 24 character GUID of the project your app lives in',
    'app' : 'Unique 24 character GUID of the app you want to delete',
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project + "/apps/" + fhc.appId(argv.app);
  },
  'method' : 'get'
};
