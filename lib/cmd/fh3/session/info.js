/* globals i18n */
var fhreq = require("../../../utils/request");
var common = require("../../../common.js");

module.exports = {
  'desc' : i18n._('Info Auth Policies Session'),
  'examples' :
    [{
      cmd : 'fhc session info --token=<token>',
      desc : "Info about Auth Policies Session with <token>"
    }],
  'demand' : ['token'],
  'alias' : {
    'token': 't',
    0: 'token'
  },
  'describe' : {
    'token' : i18n._("Token of Auth Policies Session")
  },
  'customCmd' : function(params,cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/sessioninfo", {sessionToken: params.token}, i18n._("Error in session info call: "), function(err, session) {
      if (err) {
        return cb(err);
      }
      return cb(null, session);
    });
  }
};