/* globals i18n */

var fhreq = require("../../../../utils/request");
var common = require("../../../../common");

module.exports = {
  'desc' : i18n._('Update Field of App Store).'),
  'examples' : [{
    cmd : 'fhc admin appstore updatefield --name=<name> --value=<value>',
    desc : i18n._('Update <value> of field with <name> of the App Store')
  }],
  'demand' : ['name','value'],
  'alias' : {
    'name' : 'n',
    'value' : 'v',
    'json' : 'j',
    0 :'name',
    1 :'value'
  },
  'describe' : {
    'name' : i18n._("Name of the field"),
    'value' : i18n._("Value of the field"),
    'json' : i18n._('Output into json format')
  },
  'customCmd': function(params, cb) {
    var payload = {};
    payload[params.name] = params.value;
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/appstore/update", payload, i18n._("Error updating store: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!params.json) {
        return cb(null, i18n._('App Store Field updated successfully.'));
      }
      return cb(null, data);
    });
  }
};
