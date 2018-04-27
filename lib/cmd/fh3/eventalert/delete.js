/* globals i18n */
var util = require('util');

module.exports = {
  'desc' : i18n._('Delete alerts from cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert delete --app=<app> --id=<id> --env=<environment>',
    desc : i18n._('Delete alert <id> from <app> into <environment>')}],
  'demand' : ['app','id','env'],
  'alias' : {
    'app':'a',
    'id' :'i',
    'env':'e',
    'json': 'j',
    0 : 'app',
    1 : 'id',
    2 : 'env'
  },
  'describe' : {
    'app'  : i18n._("Unique 24 character GUID of your cloud application."),
    'id'   : i18n._("Unique 24 character GUID of the event alert"),
    'env'  : i18n._("Unique 24 character GUID of the environment where this application is deployed.")
  },
  'url' : function(argv) {
    return "/api/v2/mbaas/support/"+argv.env+"/apps/" + argv.app + "/alerts/" + argv.id;
  },
  'method' : 'DELETE',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      if (response.error) {
        return cb(response.error);
      }
      return cb(null, util.format(i18n._("Event alerts with ID '%s' for app '%s' into env '%s' deleted successfully."), argv.id, argv.app, argv.env));
    }
    return cb(null, response);
  }
};