/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Delete a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users delete username=<username>',
      desc : i18n._('Delete the user with <username> from RHMAP')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    'json' : 'j',
    0 : 'username'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be deleted."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/delete", {'username' : params.username}, i18n._("Error deleting user: "), function(err, res) {
      if (err) {
        return cb(err);
      }
      if (!params.json && res.status === 'ok') {
        return cb(null, i18n._("User deleted successfully."));
      }
      return cb(undefined, res);
    });
  }
};