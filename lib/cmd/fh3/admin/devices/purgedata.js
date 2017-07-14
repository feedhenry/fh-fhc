/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('Purge the data of a device'),
  'examples' : [{
    cmd : 'fhc admin devices purgedata --cuid=<cuid> --blacklisted',
    desc : i18n._('Purge the data of device with <cuid> and set as blacklisted')
  }],
  'demand' : ['cuid'],
  'alias' : {
    'cuid':'c',
    'blacklisted':'b',
    'json':'j',
    0:'cuid'
  },
  'describe' : {
    'cuid' : i18n._("Device CUID"),
    'blacklisted' : i18n._("It is set the device as blacklisted"),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(argv, cb) {
    var doPurge = false;
    if (argv.blacklisted) {
      doPurge = true;
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/update", {"cuid": argv.cuid, "blacklisted": doPurge}, i18n._("Error updating device: "), function(err, data) {
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