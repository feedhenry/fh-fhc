/* globals i18n */
var common = require('../../../../common.js');
var fhreq = require("../../../../utils/request");

module.exports = {
  'desc' : i18n._('List users from device'),
  'examples' : [{
    cmd : 'fhc admin devices listusers --cuid=<cuid>',
    desc : i18n._('List all users from device with <cuid>')
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
    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/device/listusers", {"cuid": argv.cuid}, "Error listing device apps: ", function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(undefined, data);
    });
  }
};