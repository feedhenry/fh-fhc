/* globals i18n */
var common = require("../../../common");
module.exports = {
  'desc' : i18n._('Reads an app under a project.'),
  'examples' : [{ cmd : 'fhc app read --project=1a --app=2b', desc : i18n._('Reads app with id 2b under project with id 1a')}],
  'demand' : ['app'],
  'alias' : {
    'project' : 'p',
    'app' : 'a',
    0 : 'project',
    1 : 'app'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project your app lives in'),
    'app' : i18n._('Unique 24 character GUID of the app you want to read')
  },
  'customCmd' : function(params,cb) {
    common.readApp(params.project, params.app, function(err, app) {
      if (err) {
        return cb(err);
      }
      return cb(err, app);
    });
  }
};