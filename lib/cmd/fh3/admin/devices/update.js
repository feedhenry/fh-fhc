/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Update a device.'),
  'examples' : [{
    cmd : 'fhc admin devices update --cuid=<cuid> --name=<name>',
    desc : i18n._('Update device with <cuid>')
  }],
  'demand' : ['cuid','name'],
  'alias' : {
    'cuid':'c',
    'name':'n',
    'json':'j',
    0:'cuid',
    1:'name'
  },
  'describe' : {
    'cuid' : i18n._("Device CUID"),
    'name' : i18n._("Value to update the device name"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": argv.cuid, "name": argv.name}, i18n._("Error updating device: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        data._table = common.createTableForDevices([data]);
      }
      return cb(undefined, data);
    });
  }
};
