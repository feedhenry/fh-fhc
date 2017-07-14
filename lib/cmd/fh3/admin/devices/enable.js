/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Enable device'),
  'examples' : [{
    cmd : 'fhc admin devices enable --cuid=<cuid>',
    desc : i18n._('Enable device with <cuid>')
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": argv.cuid, "disabled": false}, i18n._("Error updating device: "), function(err, data) {
      if (err) {
        return cb(err);
      }
      if (!argv.json) {
        data._table = common.createTableForDevices([data]);
      }
      return cb(null, data);
    });
  }
};