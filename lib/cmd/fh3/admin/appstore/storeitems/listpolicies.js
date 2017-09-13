/* globals i18n */
var common = require("../../../../../common");
var fhreq = require("../../../../../utils/request");

module.exports = {
  'desc' : i18n._('List all policies from store item into AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems listpolicies --id=<id>',
    desc : i18n._('List all policies from store item with <id>')
  }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    0 :'id'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item.")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/listpolicies", {"guid":params.id}, i18n._("Error Listing item policies: "), cb);
  }
};
