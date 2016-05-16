/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc': i18n._('Delete log file from specified environment'),
  'examples': [{
    cmd: 'fhc app logs delete --app=2bf4gg3gfefsdgfdsg4fdgs34 --env=dev --logname=env.log',
    desc: i18n._('Removes "env.log" file from "dev" environment')
  }],
  'demand': ['app', 'env','logname'],
  'alias': {
    'app': 'a',
    'env': 'e',
    'logname': 'f',
    0: 'app',
    1: 'env',
    2: 'logname'
  },
  'describe': {
    'app': i18n._('Unique 24 character GUID of your application.'),
    'env': i18n._('Application Environment ID (dev, prod)'),
    'logname': i18n._('Full name of log file including extension')
  },
  'method': 'DELETE',
  'url': function (argv) {
    return "api/v2/mbaas/" + fhc.curTarget + "/" + argv.deploytarget + "/apps/" + fhc.appId(argv.guid) + "/logs";
  },
  'preCmd': function (params, cb) {
    var payload = {
      "guid": params.app,
      "action": "delete",
      "deploytarget": params.env,
      "logname": params.logname
    };
    return cb(null, payload);
  }
};
