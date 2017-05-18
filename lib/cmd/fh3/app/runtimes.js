/* globals i18n */
var ini = require("../../../utils/ini");
var common = require('../../../common.js');

module.exports = {
  'desc': i18n._('Check the available runtimes for an app'),
  'examples':
  [{
    cmd: 'fhc app runtimes --id=<app-id> --domain=<domain>',
    desc: i18n._('Runtimes <app-id> in domain <domain>')
  }],
  'demand': ['id'],
  'alias': {
    'id': 'i',
    'domain': 'd',
    0: 'id',
    1: 'domain'
  },
  'describe': {
    'id': i18n._('Unique 24 character GUID of the application '),
    'domain': i18n._('The name of the domain from where the app is')
  },
  'url': function(argv) {
    var domain = argv.domain || ini.get("domain");
    var appId = argv.id;
    return "/api/v2/mbaas/" + domain + "/dev/apps/" + appId + "/runtimes";
  },
  'postCmd': function(response, cb) {
    if (response.code == 200) {
      response._table = common.createTableForRuntimes(response.result);
      return cb(null, response);
    }
  },
  preCmd: function(params, cb) {
    var request = {
      id: params.id,
      domain: params.domain || ini.get("domain")
    };

    return cb(null, request);
  },
  'method': 'get'
};
