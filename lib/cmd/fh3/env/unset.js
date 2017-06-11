/* globals i18n */
module.exports = {
  'desc' : i18n._('Unset cloud app environment variables'),
  'examples' :
    [{
      cmd : 'fhc env unset --app=<app> --id=<id> --env=<environment>',
      desc : "Unset cloud app environment variables from the <app> and <env>"
    }],
  'demand' : ['app','id'],
  'alias' : {
    'app': 'a',
    'id': 'i',
    'env': 'e',
    'json': 'j',
    0: 'app',
    1: 'id',
    2: 'env',
    3: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the cloud app."),
    'id' : i18n._("Unique 24 character GUID of the environment variable."),
    'env': i18n._("Default value is dev. Environment ID which you want create the environment variable."),
    'json' : i18n._("Output in json format")
  },
  'url' : function(argv) {
    argv.env = argv.env || 'dev';
    var url = "/box/api/apps/" + argv.app + "/env/" + argv.env + "/envvars/" + argv.id + "/unset";
    return url;
  },
  'method' : 'put'
};