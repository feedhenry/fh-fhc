/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Read store item from AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems read --id=<id>',
    desc : i18n._('Read store item with <id> from the App Store')
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/read", {"guid": params.id}, i18n._("Error reading store item: "), function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        var headers = ['ID', 'Name', 'Description','Auth Policies','restrictToGroups'];
        var fields = ['guid', 'name','description','authpolicies','restrictToGroups'];
        data._table = common.createTableFromArray(headers, fields, [data]);
      }
      return cb(null, data);
    });
  }
};
