/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Read a RHMAP User'),
  'examples' :
    [{
      cmd : 'fhc admin users read username=<username>',
      desc : i18n._('Read the user with <username> from RHMAP')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    'json' : 'j',
    0 : 'username'
  },
  'describe' : {
    'username' : i18n._("Username of the user which will be read."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/read", {"username": params.username}, i18n._("Error reading user: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === 'ok') {
        data._table = common.createTableForUsers([data]);
      }
      return cb(undefined, data);
    });
  }
};