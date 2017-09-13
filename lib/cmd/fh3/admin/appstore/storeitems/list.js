/* globals i18n */
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('List all store items from AppStore'),
  'examples' : [{
    cmd : 'fhc admin appstore storeitems list',
    desc : i18n._('List all Store Items from the App Store')
  }],
  'demand' : [],
  'alias' : {
    'json' : 'j'
  },
  'describe' : {
    'json' : i18n._('Output into json format')
  },
  'url' : function() {
    return "/box/srv/1.1/admin/storeitem/list";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      var headers = ['ID', 'Name', 'Description','Auth Policies','restrictToGroups'];
      var fields = ['guid', 'name','description','authpolicies','restrictToGroups'];
      response._table = common.createTableFromArray(headers, fields, response.list);
    }
    return cb(null, response);
  }
};
