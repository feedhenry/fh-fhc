/* globals i18n */
var fhreq = require("../../../utils/request");
var common = require("../../../common.js");

module.exports = {
  'desc' : i18n._('Verify Auth Policies Session'),
  'examples' :
    [{
      cmd : 'fhc session verify --token=<token>',
      desc : "Verify Auth Policies Session with <token>"
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/verifysession", {sessionToken: params.token}, i18n._("Error in verify session call: "), function(err, session) {
      if (err) {
        return cb(err);
      }
      return cb(null, session);
    });
  }
};