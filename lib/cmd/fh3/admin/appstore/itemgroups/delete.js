/* globals i18n */
var common = require('../../../../../common.js');
var fhreq = require("../../../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Delete App Store Item Group.'),
  'examples' : [{
    cmd : 'fhc admin appstore itemgroups delete --guid=<guid>',
    desc : i18n._('Delete App Store Item Group with <guid>')
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitemgroup/delete", {"guid": argv.guid}, i18n._("Error deleting group: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        return cb(null,util.format(i18n._("Item Groups with the guid '%s' deleted successfully."), argv.guid));
      }
      return cb(null, data);
    });
  }
};