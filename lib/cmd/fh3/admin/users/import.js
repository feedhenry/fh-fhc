/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Import users from a csv file to RHMAP'),
  'examples' :
    [{
      cmd : 'fhc admin users import --file=<file> --invite=<true|false> --roles=<roles> --authpolicies=<authpolicies>',
      desc : i18n._('Import users from <file> to RHMAP with options for <invite>, <roles> and <authpolicies>')
    }],
  'demand' : ['file'],
  'alias' : {
    'file' : 'f',
    'invite' : 'i',
    'roles' : 'r',
    'authpolicies' : 'a',
    0 : 'file',
    1 : 'invite',
    2 : 'roles',
    3 : 'authpolicies'
  },
  'describe' : {
    'file' : i18n._("Path and name of the csv file with the users which will be imported to RHMAP"),
    'invite' : i18n._("Boolean to define if is to send or not an email invitation for this user"),
    'roles' : i18n._("Roles permissions for the user. (E.g 'sub')"),
    'authpolicies' : i18n._("[DEPRECATED] Unique 24 character GUID of Auth Policies. Run '$fhc admin policies list' to check it.")
  },
  'customCmd': function(params, cb) {
    params.invite = (params.invite) ? 'true' : 'false';
    var payload = {
      invite : params.invite,
      roles: (params.roles) ? params.roles: '',
      authpolicies: (params.authpolicies) ? params.authpolicies: ''
    };
    fhreq.uploadFile("/box/srv/1.1/admin/user/import", params.file, payload, "text/csv", function(err, res) {
      if (err) {
        return cb(err);
      }
      var response = JSON.parse(res);
      if (response.status.toLowerCase() === "ok" && response.cachekey) {
        common.waitFor(response.cachekey, cb);
      } else {
        cb(response.message);
      }
    });
  }
};