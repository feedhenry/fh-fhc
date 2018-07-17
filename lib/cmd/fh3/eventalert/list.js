/* globals i18n */
var common = require('../../../common.js');
var util = require('util');
var fhc = require("../../../fhc");

module.exports = {
  'desc' : i18n._('List of all event alerts from a cloud application'),
  'examples' : [{
    cmd : 'fhc eventalert list --app=<app> --env=<environment>',
    desc : i18n._('List all event alerts from <app> into <environment>')}],
  'demand' : ['app', 'env'],
  'alias' : {
    'app':'a',
    'env':'e',
    'json': 'j',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app'   : i18n._("Unique 24 character GUID of your cloud application."),
    'env'   : i18n._("Unique 24 character GUID of the environment where this application is deployed."),
    'json' : i18n._("Output in json format")
  },
  'url' : function(argv) {
    return "/api/v2/mbaas/"+ fhc.config.get('domain') + "/" +argv.env+"/apps/" + argv.app + "/alerts";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json && response.status === "ok") {
      if (response.list && response.list.length > 0) {
        response._table = common.createTableForEventAlert(response.list);
      } else {
        return cb(null, util.format(i18n._("Alerts not found from app '%s' into env '%s'."), argv.app, argv.env));
      }
    }
    return cb(null, response);
  }
};