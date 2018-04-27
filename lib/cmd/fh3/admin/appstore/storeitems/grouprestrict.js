/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Update group restriction of the store item'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems grouprestrict --id=<id> --restrictToGroups=<true|false>',
    desc : i18n._('Update <restrictToGroups> of the store item with <id>')
  }],
  'demand' : ['id','restrictToGroups'],
  'alias' : {
    'id' : 'i',
    'restrictToGroups' : 'r',
    0 :'id',
    1 :'restrictToGroups'
  },
  'describe' : {
    'id' : i18n._("Unique 24 character GUID of the store item."),
    'restrictToGroups' : i18n._("Boolean to define that the item store will be restrict to groups")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/grouprestrict", {"guid":params.id,"restrictToGroups":params.restrictToGroups}, i18n._("Error set restrict-to-groups flag on item: "), function(err,data) {
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
