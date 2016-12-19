/* globals i18n */
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Reads an cordova light app under a project.'),
  'examples' : [{ cmd : 'fhc cordova migrate --app=2b', desc : i18n._('Migrate a cordova light app (config.json) to a full cordova app (config.xml) with id 2b')}],
  'demand' : ['app'],
  'alias' : {
    'app' : 'a',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the app you want to delete')
  },
  'url' : function(argv){
    return "box/api/migrate/" + fhc.appId(argv.app);
  },
  'method' : 'get'
};
