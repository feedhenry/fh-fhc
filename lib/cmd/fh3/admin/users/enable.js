/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Enable a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users enable --username=<username>',
      desc : i18n._('Enable the user with <username> from RHMAP')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    'json' : 'j',
    0 : 'username'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be enable."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.admin.users.update({username: params.username, enabled: true, json:params.json}, cb);
  }
};