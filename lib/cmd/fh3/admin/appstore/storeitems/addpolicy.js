/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Add policy into store item'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems addpolicy --id=<id> --policy=<policy>',
    desc : i18n._('Add <policy> into store item with <id> into AppStore')
  }],
  'demand' : ['id','policy'],
  'alias' : {
    'id' : 'i',
    'policy' : 'p',
    0 :'id',
    1 :'policy'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'policy' : i18n._("Unique 24 character GUID of the auth policy")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/addpolicy", {"guid":params.id,"authguid":params.policy}, i18n._("Error adding policy to item: "), function(err,data) {
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
