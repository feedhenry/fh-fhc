/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('List devices from RHMAP Users'),
  'examples' :
    [{
      cmd : 'fhc admin users listdevices --username=<username>',
      desc : i18n._('List all devices from the RHMAP user with <username>')
    }],
  'demand' : ['username'],
  'alias' : {
    'username' : 'u',
    0 : 'username'
  },
  'describe' : {
    'username' : i18n._("Username of the RHMAP user.")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/user/listdevices", {"username": params.username}, i18n._("Error listing user devices: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, data);
    });
  }
};