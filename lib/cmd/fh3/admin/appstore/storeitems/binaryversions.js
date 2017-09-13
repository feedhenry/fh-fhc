/* globals i18n */

var fhreq = require("../../../../../utils/request");
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('Check the binary versions of a store item'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems binaryversions --id=<id>',
    desc : i18n._('Check the binary versions of the store item with <id>')
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/storeitem/read", {"guid":params.id}, i18n._("Error reading binary item: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      var ret = {"name":data.name};
      ret.versions = [];
      data.binaries.forEach(function(item) {
        item.versions.forEach(function(it) {
          ret.versions.push(it);
        });
      });
      return cb(undefined, ret);
    });
  }
};
