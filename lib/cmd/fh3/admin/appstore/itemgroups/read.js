/* globals i18n */
var common = require('../../../../../common.js');
var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Read App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups read --guid=<guid>',
    desc : i18n._('Read App Store Item Group with <guid>')
  }],
  'demand' : ['guid'],
  'alias' : {
    'guid':'g',
    'json':'j',
    0:'guid'
  },
  'describe' : {
    'guid' : i18n._("Unique 24 character GUID of the item group"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/read", {"guid": argv.guid}, i18n._("Error reading group: "), function(err, data) {
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