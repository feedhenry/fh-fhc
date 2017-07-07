/* globals i18n */
var common = require('../../../../common.js');
var fhc = require("../../../../fhc");
var _ = require('underscore');

var headers = ["Label", "Key"];
var fields = ["label", "key"];

module.exports = {
  'desc' : i18n._('Read a ssh user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user read --label=<label>',
      desc : i18n._("Read a user API Key with the <label>")
    }],
  'demand' : ['label'],
  'alias' : {
    'label': 'l',
    'json': 'j',
    0 : 'label'
  },
  'describe' : {
    'label' : i18n._("Label of the API Key Management that you want to read."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.keys.user.list({json:true}, function(err, keys) {
      if (err) {
        return cb(err);
      }
      var key = _.findWhere(keys.list, {label: params.label});
      if (!key) {
        return cb(i18n._('Key not found: ') + params.label);
      }
      if (!params.json) {
        params._table = common.createTableFromArray(headers, fields, [key]);
        return cb(null, params);
      }
      return cb(null, key);
    });
  }
};