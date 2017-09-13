/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Create a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users create --username=<username> --password=<password> --email=<email> --name=<name> --roles=<roles> --authpolicies=<authpolicies> --invite=<true|false> --teams=<teams> --groups=<groups>',
      desc : i18n._('Create a RHMAP user with <username>, <password>, <email>, <name>, <roles>, <authpolicies>, <invitation>, <teamIds>, <groups>')
    }],
  'demand' : ['username','email'],
  'alias' : {
    'username' : 'u',
    'password' : 'p',
    'email' : 'e',
    'name' : 'n',
    'roles' : 'r',
    'authpolicies' : 'a',
    'invite' : 'i',
    'teams' : 't',
    'groups' : 'g',
    'json' : 'j',
    0 : 'username',
    1 : 'email',
    2 : 'password',
    3 : 'name' ,
    4 : 'roles',
    5 : 'authpolicies',
    6 : 'invite',
    7 : 'teams',
    8 : 'groups'
  },
  'describe' : {
    'username' : i18n._("Username of the new user."),
    'email' : i18n._("Email of the new user. It will be used to send the invite email."),
    'password' : i18n._("Password for this user login into RHMAP"),
    'name' : i18n._("Name of the new user"),
    'roles' : i18n._("Roles permissions for the user. (E.g 'sub')"),
    'authpolicies' : i18n._("Unique 24 character GUID of Auth Policies. Run '$fhc admin policies list' to check it."),
    'invite' : i18n._("Boolean to define if is to  send or not an email invitation for this new user"),
    'teams' : i18n._("Unique 24 character GUID of the teams which the new user will be a member"),
    'groups' : i18n._("Unique 24 character GUID of the groups which the new user will be a member"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var data = {'username' : params.username};
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
    if (params.invite) {
      data.invite = params.invite;
    }
    if (params.teams) {
      data.teamIds = params.teams;
    }
    if (params.groups) {
      data.storeItemGroups = params.groups;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/create", data, i18n._("Error creating user: "), function(err, res) {
      if (err) {
        return cb(err);
      }
      if (!params.json && res.status === 'ok') {
        return cb(null, i18n._("User created successfully."));
      }
      return cb(null, res);
    });
  }
};