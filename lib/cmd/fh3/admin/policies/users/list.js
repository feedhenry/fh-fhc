/* globals i18n */
var common = require("../../../../../common");
var fhc = require("../../../../../fhc");

module.exports = {
  'desc' : i18n._('[DEPRECATED] List users of Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies users list --id=<id>',
      desc : i18n._('[DEPRECATED] List users of Auth Policy with <id>')
    }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    'json' : 'j',
    0 : 'id'
  },
  'describe' : {
    'id' : i18n._('ID of the Auth Policy'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.admin.policies.read({id:params.id, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (!params.json && data.status === "ok") {
        if ( data.users.length > 0 ) {
          var headers = ['GUID', 'Email','Name', 'userId'];
          var fields = ['guid', 'email','name', 'userId'];
          params._table = common.createTableFromArray(headers, fields, data.users);
          return cb(null, params);
        } else {
          return cb(null, i18n._('No users associated with this Auth Policy.'));
        }
      }
      return cb(null, data.users);
    });
  }
};