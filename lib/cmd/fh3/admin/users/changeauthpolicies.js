/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Change auth policies of the a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users changeauthpolicies --username=<username> --authpolicies=<authpolicies>',
      desc : i18n._('Change <authpolicies> of the user with <username> from RHMAP')
    }],
  'demand' : ['username','authpolicies'],
  'alias' : {
    'username' : 'u',
    'authpolicies' : 'a',
    'json' : 'j',
    0 : 'username',
    1 : 'authpolicies'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be changed."),
    'authpolicies' : i18n._("Unique 24 character GUID of Auth Policies. Run '$fhc admin policies list' to check it."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.admin.users.update({username: params.username, authpolicies: params.authpolicies, json:params.json}, cb);
  }
};