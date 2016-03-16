var log = require("../../../utils/log");
var ini = require("../../../utils/ini");

module.exports = {
  'desc': 'Undeploy an app given the domain and environment it is deployed to',
  'examples': [{
    cmd: 'fhc app undeploy --id=<app-id> --env=<environment> --domain=<domain>',
    desc: 'Undeploy <app-id> from environment <environment> in domain <domain>'
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
    'id': 'Unique 24 character GUID of the application to undeploy',
    'env': 'The ID of the environment from where to undeploy the app',
    'domain': 'The name of the domain from where to undeploy the app',
    'embed': 'If this flag is present then {embed: true} will be sent'
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

    log.info("Embed flag set to " + request.embed);
    return cb(null, request);
  }
};
