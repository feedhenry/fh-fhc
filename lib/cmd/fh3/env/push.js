/* globals i18n */
module.exports = {
  'desc' : i18n._('Push cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env push --app=<app> --env=<environment>',
      desc : "Push cloud app environment variables from the <app> and <env>"
    }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    'env': 'e',
    0: 'app',
    1: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable.")
  },
  'url' : function(argv) {
    argv.dev = argv.dev || 'dev';
    return "box/api/apps/" + argv.app + "/env/"+ argv.dev +"/envvars/push";
  },
  'method' : 'post'
};