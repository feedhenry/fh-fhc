/* globals i18n */
var common = require('../../../common.js');
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Create event alert for a cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert create --app=<app> --name=<name> --categories=<categories> --severities=<severities> --events=<events> --emails=<emails> --env=<environment>',
    desc : i18n._('Create event alert for <app> into <environment> with <name>, for <categories>, with <severities>, for <events> be sent to <emails>')}],
  'demand' : ['app', 'name', 'categories', 'severities', 'events', 'emails', 'env'],
  'alias' : {
    'app':'a',
    'name':'n',
    'categories':'c',
    'severities':'s',
    'events':'ev',
    'emails':'em',
    'env':'e',
    'json':'j',
    0 : 'app',
    1 : 'name',
    2 : 'categories',
    3 : 'severities',
    4 : 'events',
    5 : 'emails',
    6 : 'env'
  },
  'describe' : {
    'app'   : i18n._("Unique 24 character GUID of your cloud application."),
    'name'   : i18n._("Name of the event alert"),
    'categories' : i18n._("Categories of this alert. (E.g APP_STATE,APP_ENVIRONMENT"),
    'severities' : i18n._("Severities of this alert. (E.g INFO,WARN,ERROR,FATAL"),
    'events' : i18n._("Severities of this alert. (E.g START_REQUESTED,DEPLOY_REQUESTED"),
    'emails' : i18n._("Emails which will received this alert. (E.g test@test.com, test2@test.com"),
    'env'   : i18n._("Unique 24 character GUID of the environment where this application is deployed."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    var url =  "/api/v2/mbaas/support/" + argv.env + "/apps/" + argv.app + "/alerts";

    var playload = {
      alertName: argv.name,
      emails: argv.emails,
      enabled: true,
      env: argv.env,
      eventCategories: argv.categories,
      eventNames: argv.events,
      eventSeverities: argv.severities,
      uid:argv.app
    };

    common.doApiCall(fhreq.getFeedHenryUrl(), url, playload, i18n._("Error to create: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json && data && data.status === "ok") {
        data._table = common.createTableForEventAlert([data]);
        return cb(null, data);
      }
      return cb(null, data);
    });
  }
};