/* globals i18n */
var common = require('../../../../common.js');
var headers = ["Label", "Key"];
var fields = ["label", "key"];
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");

module.exports = {
  'desc' : i18n._('List user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user list',
      desc : i18n._("List all API Key of the logged in user")
    }],
  'demand' : [],
  'alias' : {
    'json': 'j'
  },
  'describe' : {
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var url = 'box/srv/1.1/ide/' + fhc.curTarget + '/api/list';
    var payload = {type: "user"};
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload, i18n._("Error reading Api Keys: "), function(err, keys) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        params._table = common.createTableFromArray(headers, fields, keys.list);
        return cb(err, params);
      }
      return cb(null, keys);
    });
  }
};