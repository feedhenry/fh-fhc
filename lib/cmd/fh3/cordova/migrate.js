/* globals i18n */
module.exports = {
  'desc' : i18n._('[DEPRECATED] Migrate a Cordova Light app (config.json) to a full cordova app (config.xml).'),
  'examples' : [{ cmd : 'fhc cordova migrate --app=2b', desc : i18n._('[DEPRECATED] Migrate a cordova light app (config.json) to a full cordova app (config.xml) with id 2b')}],
  'demand' : ['app'],
  'alias' : {
    'app' : 'a',
    0 : 'app'
  },
  'describe' : {
    'app' : i18n._('Unique 24 character GUID of the app you want to delete')
  },
  'url' : function(argv) {
    return "box/api/migrate/" + argv.app;
  },
  'method' : 'get'
};
