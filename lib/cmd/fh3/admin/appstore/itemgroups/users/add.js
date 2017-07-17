/* globals i18n */
var common = require('../../../../../../common.js');
var fhreq = require("../../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Add user into App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups users add --guid=<guid> --user=<user>',
    desc : i18n._('Add <user> into App Store Item Group with <guid>')
  }],
  'demand' : ['guid','user'],
  'alias' : {
    'guid':'g',
    'user':'u',
    'json':'j',
    0:'guid',
    1:'user'
  },
  'describe' : {
    'guid' : i18n._("Unique 24 character GUID of the item group"),
    'user' : i18n._("Unique 24 character GUID of the user"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/addusers", {
      "guid": argv.guid,
      "users": [argv.user]
    }, i18n._("Error adding users: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        var headers = ['GUID', 'Name', 'Description','Store Items','Users'];
        var fields = ['guid', 'name', 'description','storeitems','users'];
        data._table = common.createTableFromArray(headers, fields, [data]);
      }
      return cb(undefined, data);
    });
  }
};