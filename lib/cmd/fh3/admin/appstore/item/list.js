/* globals i18n */
var common = require("../../../../../common");

module.exports = {
  'desc' : i18n._('List Store Items from the App Store).'),
  'examples' : [{
    cmd : 'fhc admin appstore item list',
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
    return "/box/srv/1.1/admin/appstore/liststoreitems";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      var headers = ['ID', 'Name', 'Description','RestrictToGroups','Groups'];
      var fields = ['guid', 'name','description','restrictToGroups','groups'];
      response._table = common.createTableFromArray(headers, fields, response.list);
    }
    return cb(null, response);
  }
};
