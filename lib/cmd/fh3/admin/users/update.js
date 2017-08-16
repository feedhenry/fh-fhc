/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Update a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users update --username=<username> --password=<password> --email=<email> --name=<name> --roles=<roles> --authpolicies=<authpolicies> --invite=<true|false> --teams=<teams> --groups=<groups> --enabled=<true|false>',
      desc : i18n._('Update <password>, <email>, <name>, <roles>, <authpolicies>, <invite>, <teams>, <groups>, <enabled> from the a RHMAP user with <username>')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    'email' : 'e',
    'password' : 'p',
    'name' : 'n',
    'roles' : 'r',
    'authpolicies' : 'a',
    'invite' : 'i',
    'teams' : 't',
    'groups' : 'g',
    'enabled' : 'en',
    'json' : 'j',
    0 : 'username',
    1 : 'email',
    2 : 'password',
    3 : 'name' ,
    4 : 'roles',
    5 : 'authpolicies',
    6 : 'invite',
    7 : 'teams',
    8 : 'groups',
    9 : 'enabled'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be update."),
    'email' : i18n._("Email of the user"),
    'password' : i18n._("Password for this user login into RHMAP"),
    'name' : i18n._("Name of the user"),
    'roles' : i18n._("Roles permissions for the user. (E.g 'sub')"),
    'authpolicies' : i18n._("Unique 24 character GUID of Auth Policies. Run '$fhc admin policies list' to check it."),
    'invite' : i18n._("Boolean to define if is to send or not an email invitation for this user"),
    'teams' : i18n._("Unique 24 character GUID of the teams which the user will be a member"),
    'groups' : i18n._("Unique 24 character GUID of the groups which the user will be a member"),
    'enabled' : i18n._("True for enable the user and false for disable"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var data = {username : params.username, invite : false, enabled : true };
    if (params.password) {
      data.password = params.password;
    }
    if (params.email) {
      data.email = params.email;
    }
    if (params.name) {
      data.name = params.name;
    }
    if (params.roles) {
      data.roles = params.roles;
    }
    if (params.authpolicies) {
      data.authpolicies = params.authpolicies;
    }
    if (params.teams) {
      data.teamIds = params.teams;
    }
    if (params.groups) {
      data.storeItemGroups = params.groups;
    }
    if (params.invite) {
      data.invite = 'true';
    }
    if (params.enabled !== undefined && params.enabled === false) {
      data.enabled = false;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/update", data, i18n._("Error updating user: "), function(err, res) {
      if (err) {
        return cb(err);
      }
      if (!params.json && res.status === 'ok') {
        res._table = common.createTableForUsers([res]);
      }
      return cb(undefined, res);
    });
  }
};