/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Add Policy into App Store).'),
  'examples' : [{
    cmd : 'fhc admin appstore policy add --id=<id>',
    desc : i18n._('Add policy with <id> into the App Store')
  }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    'json' : 'j',
    0 :'id'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the policy."),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/addpolicy", {"guid": params.id}, i18n._("Error updating item: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        return cb(null, i18n._('Policy added successfully.'));
      }
      return cb(null, data);
    });
  }
};