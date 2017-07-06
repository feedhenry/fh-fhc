/* globals i18n */
var common = require('../../../common.js');
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Update event alerts from cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert update --app=<app> --id=<id> --name=<name> --categories=<categories> --severities=<severities> --events=<events> --emails=<emails> --env=<environment>',
    desc : i18n._('Update event alert with <id> from <app> into <environment> with <name>, for <categories>, with <severities>, for <events> be sent to <emails>')}],
  'demand' : ['app', 'id', 'env'],
  'alias' : {
    'app':'a',
    'id':'i',
    'name':'n',
    'categories':'c',
    'severities':'s',
    'events':'ev',
    'emails':'em',
    'env':'e',
    'json':'j',
    0 : 'app',
    1 : 'id',
    2 : 'name',
    3 : 'categories',
    4 : 'severities',
    5 : 'events',
    6 : 'emails',
    7 : 'env'
  },
  'describe' : {
    'app'  : i18n._("Unique 24 character GUID of your cloud application."),
    'id'   : i18n._("Unique 24 character GUID of the event alert"),
    'name'   : i18n._("Name of the event alert"),
    'categories' : i18n._("Categories of this alert. (E.g APP_STATE,APP_ENVIRONMENT"),
    'severities' : i18n._("Severities of this alert. (E.g INFO,WARN,ERROR,FATAL"),
    'events' : i18n._("Severities of this alert. (E.g START_REQUESTED,DEPLOY_REQUESTED"),
    'emails' : i18n._("Emails which will received this alert. (E.g test@test.com, test2@test.com"),
    'env'  : i18n._("Unique 24 character GUID of the environment where this application is deployed."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    var url =  "/api/v2/mbaas/support/" + argv.env + "/apps/" + argv.app + "/alerts/" +argv.id;

    fhc.eventalert.read({app: argv.app, env: argv.env, id:argv.id, json:true}, function(err, alert) {
      if (err) {
        return cb(err);
      }
      if (!alert) {
        return cb(null, i18n._('Alert not found with GUID: ') + argv.id);
      }

      alert.alertName = argv.name || alert.alertName;
      alert.emails = argv.emails || alert.emails;
      alert.eventCategories = argv.categories || alert.eventCategories;
      alert.eventNames = argv.events || alert.eventNames;
      alert.eventSeverities = argv.severities || alert.eventSeverities;

      fhreq.PUT(fhreq.getFeedHenryUrl(), url, alert, function(err, response) {
        if (err) {
          return cb(err);
        }
        if (!argv.json && response && response.status === "ok") {
          response._table = common.createTableForEventAlert([response]);
          return cb(null, response);
        }
        return cb(null, response);
      });
    });
  }
};