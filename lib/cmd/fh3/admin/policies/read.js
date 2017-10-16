/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('[DEPRECATED] Read Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies read --id=<id>',
      desc : i18n._('[DEPRECATED] Read Auth Policy with <id>')
    }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    'json' : 'j',
    0 : 'id'
  },
  'describe' : {
    'id' : i18n._('ID of your policy'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/read", {"policyId": params.id}, i18n._("Error reading policy: "), function(err, response) {
      if (err) {
        return cb(err);
      }
      if (!params.json && response.status === "ok") {
        var headers = ['GUID', 'Policy Id','Type', 'checkUserApproved', 'checkUserExists'];
        var fields = ['guid', 'policyId','policyType', 'checkUserApproved', 'checkUserExists'];
        response._table = common.createTableFromArray(headers, fields, [response]);
      }
      return cb(null, response);
    });
  }
};