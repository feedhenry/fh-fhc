/* globals i18n */
module.exports = {
  'desc' : i18n._('Deleate cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env delete --app=<app> --id=<id> --env=<environment>',
      desc : "Delete the cloud app environment variables with the <id> from the <app> in the <env>"
    }],
  'demand' : ['app', 'id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'id',
    3: 'env',
    4: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'url' : function(argv) {
    argv.env = argv.env || 'dev';
    return "/box/api/apps/" + argv.app + "/env/" + argv.env + "/envvars/" + argv.id ;
  },
  'method' : 'DELETE'
};