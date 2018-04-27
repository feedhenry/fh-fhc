/* globals i18n */
var common = require('../../../common.js');
var fhc = require("../../../fhc");
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Read event alert from cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert read --app=<app> --id=<id> --env=<environment>',
    desc : i18n._('Read alert <id> from <app> into <environment>')}],
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
  'customCmd': function(argv, cb) {
    fhc.eventalert.list({app: argv.app, env: argv.env, json:true}, function(err, alerts) {
      if (err) {
        return cb(err);
      }
      var alert = _.findWhere(alerts.list, {guid: argv.id});
      if (!argv.json) {
        if (!alert) {
          return cb(null, i18n._('Alert not found with GUID: ') + argv.id);
        }
        alert._table = common.createTableForEventAlert([alert]);
      }
      return cb(null, alert);
    });
  }
};