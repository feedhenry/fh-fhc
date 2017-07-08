/* globals i18n */
var common = require("../../../../common");

module.exports = {
  'desc' : i18n._('Read App Store'),
  'examples' : [{
    cmd : 'fhc admin appstore read',
    desc : i18n._('Read App Store of this domain')
  }],
  'demand' : [],
  'alias' : {
    'json' : 'j'
  },
  'describe' : {
    'json' : i18n._('Output into json format')
  },
  'url' : function() {
    return "/box/srv/1.1/admin/appstore/read";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      var headers = ['ID', 'Name', 'Description'];
      var fields = ['guid', 'name','description'];
      response._table = common.createTableFromArray(headers, fields, [response]);
    }
    return cb(null, response);
  }
};
