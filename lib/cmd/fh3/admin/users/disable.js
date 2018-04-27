/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Disable a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users disable --username=<username>',
      desc : i18n._('Disable the user with <username> from RHMAP')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    'json' : 'j',
    0 : 'username'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be disable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.admin.users.update({username : params.username, enabled: false, json:params.json}, cb);
  }
};

