/* globals i18n */
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('Change roles of the a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users changeroles --username=<username> --roles=<roles>',
      desc : i18n._('Change <roles> of the user with <username> from RHMAP')
    }],
  'demand' : ['username','roles'],
  'alias' : {
    'username' : 'u',
    'roles' : 'r',
    'json' : 'j',
    0 : 'username',
    1 : 'roles'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be changed."),
    'roles' : i18n._("Roles permissions for the user. (E.g 'sub')"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.admin.users.update({username: params.username, roles: params.roles, json:params.json}, cb);
  }
};