/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");

var headers = ["Label", "Key"];
var fields = ["label", "key"];


module.exports = {
  'desc' : i18n._('Add a user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user add --label=<label>',
      desc : i18n._("Add the a new suer key with the <label>")
    }],
  'demand' : ['label'],
  'alias' : {
    'label': 'l',
    'json': 'j',
    0 : 'label'
  },
  'describe' : {
    'label' : i18n._("Label of the API Key that you want to add."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    var url = "box/srv/1.1/ide/" + fhc.curTarget + "/api/create";
    var payload = {
      "type":"user",
      "label": params.label,
      "fields": {
        "label": params.label
      }
    };
    common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error add Api Key: "), function(err, key) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        params._table = common.createTableFromArray(headers, fields, [key.apiKey]);
        return cb(null, params);
      }
      return cb(null, key);
    });
  }
};