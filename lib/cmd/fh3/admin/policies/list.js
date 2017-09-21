/* globals i18n */
var common = require("../../../../common");

module.exports = {
  'desc' : i18n._('[DEPRECATED] List Auth Policies'),
  'examples' :
    [{
      cmd : 'fhc admin policies list',
      desc : i18n._('[DEPRECATED] List all Auth Policies of the target domain')
    }],
  'demand' : [],
  'alias' : {
    'json' : 'j'
  },
  'describe' : {
    'json' : i18n._("Output in json format")
  },
  'url' : function() {
    return "/box/srv/1.1/admin/authpolicy/list";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json && response.status === "ok") {
      var headers = ['GUID', 'Policy Id','Type', 'checkUserApproved', 'checkUserExists'];
      var fields = ['guid', 'policyId','policyType', 'checkUserApproved', 'checkUserExists'];
      if (response.list.length > 0) {
        response._table = common.createTableFromArray(headers, fields, response.list);
      } else {
        return cb(null,  i18n._('No Auth Policies found for the target domain'));
      }
    }
    return cb(null, response);
  }
};