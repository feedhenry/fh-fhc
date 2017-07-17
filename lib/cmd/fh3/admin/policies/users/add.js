/* globals i18n */
var common = require("../../../../../common");
var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Add the User into a Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies users add --guid=<guid> --user=<user>',
      desc : i18n._('Add <user> to Auth Policy with <guid>')
    }],
  'demand' : ['guid','user'],
  'alias' : {
    'guid' : 'i',
    'user' : 'u',
    'json' : 'j',
    0 : 'guid',
    1 : 'user'
  },
  'describe' : {
    'guid' : i18n._('Unique 24 character GUID of the policy'),
    'user' : i18n._('Unique UserId into RHMAP'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/addusers", {guid: params.guid, users: [params.user]}, i18n._("Error adding users to policy: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        return cb(null, i18n._('User successfully added from Auth Policy'));
      }
      return cb(null, data);
    });
  }
};