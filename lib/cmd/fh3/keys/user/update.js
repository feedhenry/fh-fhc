/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");

var headers = ["Label", "Key"];
var fields = ["label", "key"];


module.exports = {
  'desc' : i18n._('Update a ssh user API Key'),
  'examples' :
    [{
      cmd : 'fhc keys user update --label=<label> --value=<value>',
      desc : i18n._("Update the <lable> with the <new> value for label")
    }],
  'demand' : ['label','value'],
  'alias' : {
    'label': 'l',
    'value': 'n',
    'json': 'j',
    0 : 'label',
    1 : 'value'
  },
  'describe' : {
    'label' : i18n._("Label of the API Key that you want to update."),
    'value' : i18n._("Value for update the label."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    fhc.keys.user.read({label:params.label, json:true}, function(err, key) {
      if (err) {
        return cb(err);
      }
      var url = "box/srv/1.1/ide/" + fhc.curTarget + "/api/update";
      var payload = {
        "key": key.key,
        "label": params.value,
        "fields": {
          "label": params.value
        }
      };
      common.doApiCall(fhreq.getFeedHenryUrl(), url, payload,  i18n._("Error updating key: "), function(err, key) {
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