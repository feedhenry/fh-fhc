/* globals i18n */
var fhreq = require("../../utils/request");
var common = require("../../common.js");

module.exports = {
  'desc' : i18n._('Performs an auth call against an Auth Policy'),
  'examples' : [{
    cmd : 'fhc auth --policy=<policy> --app=<app> --device=<device> --params=<params>',
    desc : i18n._('Performs a auth call against  Auth Policy')}],
  'demand' : ['policy', 'app', 'device', 'params'],
  'alias' : {
    'policy':'p',
    'app':'a',
    'device':'d',
    'params':'p',
    0 : 'policy',
    1 : 'app',
    2 : 'device',
    3 : 'params'
  },
  'describe' : {
    'policy' : i18n._("Unique 24 character GUID of your Auth Policy."),
    'app' : i18n._("Unique 24 character GUID of your client application."),
    'device' : i18n._("Unique 24 character GUID of the device"),
    'params' : i18n._("The auth parameters specific to the auth policy")
  },
  'customCmd': function(argv, cb) {
    if (typeof argv.params === 'string') {
      argv.params = JSON.parse(argv.params);
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/auth", {
      policyId: argv.policy,
      clientToken: argv.app,
      device: argv.device,
      params: argv.params
    }, i18n._("Error in auth call: "), function(err, auth) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, auth);
    });
  }
};