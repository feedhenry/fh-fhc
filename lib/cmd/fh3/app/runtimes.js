/* globals i18n */
var ini = require("../../../utils/ini");
var common = require('../../../common.js');

module.exports = {
  'desc': i18n._('Check the available runtimes for an app'),
  'examples':
  [{
    cmd: 'fhc app runtimes --id=<app-id> --env=<environment> --domain=<domain>',
    desc: i18n._('Runtimes <app-id> from the <environment> in domain <domain>')
  }],
  'demand': ['id','env'],
  'alias': {
    'id': 'i',
    'env':'e',
    'domain': 'd',
    0: 'id',
    1: 'env',
    2: 'domain'
  },
  'describe': {
    'id': i18n._('Unique 24 character GUID of the application '),
    'env'   : i18n._("Unique 24 character GUID of the environment where this cloud application is deployed."),
    'domain': i18n._('The name of the domain from where the app is')
  },
  'url': function(argv) {
    return "/api/v2/mbaas/" + argv.domain + "/" + argv.env +"/apps/" + argv.id + "/runtimes";
  },
  'postCmd': function(argv, response, cb) {
    if (!argv.json && response.code === 200) {
      response._table = common.createTableForRuntimes(response.result);
    }
    return cb(null, response);
  },
  'preCmd': function(params, cb) {
    var request = {
      id: params.id,
      domain: params.domain || ini.get("domain"),
      env: params.env
    };

    return cb(null, request);
  },
  'method': 'get'
};
