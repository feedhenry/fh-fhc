/* globals i18n */
var common = require('../../../../../../common.js');
var fhreq = require("../../../../../../utils/request");

module.exports = {
  'desc' : i18n._('Delete item from App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups items delete --guid=<guid> --item=<item>',
    desc : i18n._('Delete <item> from App Store Item Group with <guid>')
  }],
  'demand' : ['guid','item'],
  'alias' : {
    'guid':'g',
    'item':'i',
    'json':'j',
    0:'guid',
    1:'item'
  },
  'describe' : {
    'guid' : i18n._("Unique 24 character GUID of the item group"),
    'item' : i18n._("Unique 24 character GUID of the Item Store"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/removestoreitems", {
      "guid": argv.guid,
      "storeitems": [argv.item]
    }, i18n._("Error removing apps: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        return cb(null, i18n._('Item successfully removed from the Item Group'));
      }
      return cb(undefined, data);
    });
  }
};