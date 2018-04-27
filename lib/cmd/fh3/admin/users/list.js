/* globals i18n */
var common = require("../../../../common");

module.exports = {
  'desc' : i18n._('List RHMAP Users'),
  'examples' :
    [{
      cmd : 'fhc admin users list',
      desc : i18n._('List all users of the target domain')
    }],
  'demand' : [],
  'alias' : {
    'json' : 'j'
  },
  'describe' : {
    'json' : i18n._("Output in json format")
  },
  'url' : function() {
    return "/box/srv/1.1/admin/user/list";
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json && response.status === "ok") {
      if (response.list.length > 0) {
        response._table = common.createTableForUsers(response.list);
      } else {
        return cb(null,  i18n._('No users found for the target domain'));
      }
    }
    return cb(null, response);
  }
};