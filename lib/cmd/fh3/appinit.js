/* globals i18n */
var fhreq = require("../../utils/request");

module.exports = {
  'desc' : i18n._('Makes a client app init call with the cloud'),
  'examples' : [{
    cmd : 'fhc appinit --app=<app-id> --key=<app-key> --params=<params>',
    desc : i18n._('Make the client <app> with the <key> init call with the cloud')}],
  'demand' : ['app', 'key'],
  'alias' : {
    'app':'a',
    'key':'k',
    'params':'params',
    0 : 'app',
    1 : 'key',
    2 : 'params'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your application."),
    'key' : i18n._("App API Key of the client application"),
    'params' : i18n._("Parameters for this init call")
  },
  'customCmd': function(argv, cb) {
    var dataToSend = (argv.params) ? JSON.parse(argv.params) : {};
    dataToSend.appid = argv.app;
    dataToSend.appkey = argv.key;
    dataToSend.destination = 'fhc';
    dataToSend.sdk_version = 'FHC_SDK';
    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/app/init", dataToSend, function(err, remoteData) {
      if (err) {
        return cb(i18n._("Error in init: ") + err);
      }
      return cb(err, remoteData);
    });
  }
};