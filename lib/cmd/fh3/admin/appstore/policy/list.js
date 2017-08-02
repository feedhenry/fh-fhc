/* globals i18n */
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('List Policies from App Store).'),
  'examples' : [{
    cmd : 'fhc admin appstore policy list',
    desc : i18n._('List all policies from App Store')
  }],
  'demand' : [],
  'alias' : {
    'json' : 'j'
  },
  'describe' : {
    'json' : i18n._('Output into json format')
  },
  'url' : function() {
    return "/box/srv/1.1/admin/appstore/listpolicies";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      response._table = common.createObjectTable(response);
    }
    return cb(null, response);
  }
};
