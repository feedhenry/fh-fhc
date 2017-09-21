/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('[DEPRECATED] Delete Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies delete --guid=<guid>',
      desc : i18n._('[DEPRECATED] Delete Auth Policy with <guid>')
    }],
  'demand' : ['guid'],
  'alias' : {
    'guid' : 'g',
    'json' : 'j',
    0 : 'guid'
  },
  'describe' : {
    'guid' : i18n._('Unique 24 character GUID of your policy'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/delete", {"guid": params.guid}, i18n._("Error deleting policy: "), function(err, response) {
      if (err) {
        return cb(err);
      }
      if (!params.json && response.status === "ok") {
        return cb(null, i18n._('Auth Policy deleted successfully'));
      }
      return cb(null, response);
    });
  }
};