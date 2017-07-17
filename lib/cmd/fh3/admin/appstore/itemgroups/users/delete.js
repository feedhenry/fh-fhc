/* globals i18n */
var common = require('../../../../../../common.js');
var fhreq = require("../../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Delete user from App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups users delete --guid=<guid> --user=<user>',
    desc : i18n._('Delete <user> from App Store Item Group with <guid>')
  }],
  'demand' : ['guid','user'],
  'alias' : {
    'guid': 'g',
    'user': 'u',
    'json': 'j',
    0: 'guid',
    1: 'user'
  },
  'describe' : {
    'guid' : i18n._("Unique 24 character GUID of the item group"),
    'user' : i18n._("Unique 24 character GUID of the user"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removeusers", {
      "guid": argv.guid,
      "users": [argv.user]
    }, i18n._("Error removing users: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        return cb(null, i18n._('User successfully removed from the Item Group'));
      }
      return cb(undefined, data);
    });
  }
};