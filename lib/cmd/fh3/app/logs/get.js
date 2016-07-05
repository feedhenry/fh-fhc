/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc': i18n._('Fetch log file contents from specified environment.'),
  'examples': [{
    cmd: 'fhc app logs get --app=2bf4gg3gfefsdgfdsg4fdgs34 --env=dev --logname=env.dev.log',
    desc: i18n._('Fetching log "env.dev.log" file from "dev" environment \n ' +
                 'Content of the log file will be printed on standard output.')
  }],
  'demand': ['app', 'env', 'logname'],
  'alias': {
    'app': 'a',
    'env': 'e',
    'logname': 'l',
    0: 'app',
    1: 'env',
    2: 'logname'
  },
  'describe': {
    'app': i18n._('Unique 24 character GUID of your application.'),
    'env': i18n._('Application Environment ID (dev, prod)'),
    'logname': i18n._('Full name of file to download')
  },
  'method': 'GET',
  'url': function (argv) {
    return "api/v2/mbaas/" + fhc.curTarget + "/" + argv.deploytarget + "/apps/" + fhc.appId(argv.guid) + "/logs/stream";
  },
  'preCmd': function (params, cb) {
    var payload = {
      "guid": params.app,
      "action": "download",
      "logname": params.logname,
      "deploytarget": params.env
    };
    return cb(null, payload);
  }
};
