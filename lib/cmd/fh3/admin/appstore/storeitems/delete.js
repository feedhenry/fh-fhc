/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Delete store item from AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems delete --id=<id>',
    desc : i18n._('Delete Store Item with <id> from the App Store')
  }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    'json' : 'j',
    0 :'id'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/delete", {"guid": params.id}, i18n._("Error deleting store item: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        return cb(null, i18n._('Item Store deleted successfully.'));
      }
      return cb(null, data);
    });
  }
};
