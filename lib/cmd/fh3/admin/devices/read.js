/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Read device.'),
  'examples' : [{
    cmd : 'fhc admin devices read --cuid=<cuid>',
    desc : i18n._('Read device with <cuid>')
  }],
  'demand' : ['cuid'],
  'alias' : {
    'cuid':'c',
    'json':'j',
    0:'cuid'
  },
  'describe' : {
    'cuid' : i18n._("Device CUID"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/read", {"cuid": argv.cuid}, i18n._("Error reading device: "), function(err, data) {
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
