/* globals i18n */
var log = require("../../../utils/log");
var ini = require("../../../utils/ini");
var util = require('util');

module.exports = {
  'desc': i18n._('Undeploy an app given the domain and environment it is deployed to'),
  'examples': [{
    cmd: 'fhc app undeploy --id=<app-id> --env=<environment> --domain=<domain>',
    desc: i18n._('Undeploy <app-id> from environment <environment> in domain <domain>')
  }],
  'demand': ['id', 'env'],
  'alias': {
    'id': 'i',
    'env': 'e',
    'domain': 'd',
    0: 'id',
    1: 'env',
    2: 'domain'
  },
  'describe': {
    'id': i18n._('Unique 24 character GUID of the application to undeploy'),
    'env': i18n._('The ID of the environment from where to undeploy the app'),
    'domain': i18n._('The name of the domain from where to undeploy the app'),
    'embed': i18n._('If this flag is present then {embed: true} will be sent')
  },
  'url': function (argv) {
    return [
      "api/v2/mbaas/deleteapp",
      argv.domain || ini.get("domain"),
      argv.env,
      argv.id
    ].join('/');
  },
  'method': 'post',
  preCmd: function (params, cb) {
    var request = {
      embed: false,
      id: params.id,
      env: params.env,
      domain: params.domain
    };

    if (typeof params.embed !== 'undefined') {
      request.embed = true;
    }

    log.info(util.format(i18n._("Embed flag set to %s"), request.embed));
    return cb(null, request);
  }
};
