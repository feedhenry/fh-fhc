/* globals i18n */
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('Clone event alert for a cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert clone --app=<app> --id=<id> --name=<name> --env=<environment>',
    desc : i18n._('Clone alert with <id> from <app> into <environment> with <name>')}],
  'demand' : ['app', 'id', 'env'],
  'alias' : {
    'app':'a',
    'id':'i',
    'name':'n',
    'env':'e',
    'json':'j',
    0 : 'app',
    1 : 'id',
    2 : 'name',
    3 : 'env'
  },
  'describe' : {
    'app'  : i18n._("Unique 24 character GUID of your cloud application."),
    'id'   : i18n._("Unique 24 character GUID of the event alert"),
    'name'   : i18n._("Name of the event alert"),
    'env'  : i18n._("Unique 24 character GUID of the environment where this application is deployed."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    fhc.eventalert.read({app: argv.app, env: argv.env, id:argv.id, json:true}, function(err, alert) {
      if (err) {
        return cb(err);
      }
      if (!alert) {
        return cb(null, i18n._('Alert not found with GUID: ') + argv.id);
      }
      return fhc.eventalert.create({
        app: alert.uid,
        name:argv.name,
        categories:alert.eventCategories,
        severities:alert.eventSeverities,
        env: argv.env,
        events:alert.eventNames,
        emails:alert.emails
      }, cb);
    });
  }
};