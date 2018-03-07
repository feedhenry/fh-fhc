/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");

var headers = ["Label", "Key"];
var fields = ["label", "key"];

module.exports = {
  'desc' : i18n._('Revoke a ssh user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user revoke --label=<label>',
      desc : i18n._("Revoke user API Key with the <label> of the logged in user")
    }],
  'demand' : ['label'],
  'alias' : {
    'label': 'l',
    'json': 'j',
    0 : 'label'
  },
  'describe' : {
    'label' : i18n._("Label of the API Key Management that you want to revoke."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.keys.user.read({label:params.label, json:true}, function(err, key) {
      if (err) {
        return cb(err);
      }
      var url = "box/srv/1.1/ide/" + fhc.curTarget + "/api/delete";
      var payload = {"key": key.key};
      common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error revoking key: "), function(err, key) {
        if (err) {
          return cb(err);
        }
        if (!params.json) {
          params._table = common.createTableFromArray(headers, fields, [key.apiKey]);
          return cb(null, params);
        }
        return cb(null, key);
      });
    });
  }
};