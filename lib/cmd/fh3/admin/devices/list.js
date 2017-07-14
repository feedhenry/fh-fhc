/* globals i18n */
var common = require('../../../../common.js');
module.exports = {
  'desc' : i18n._('Lists devices.'),
  'examples' : [{
    cmd : 'fhc admin devices list',
    desc : i18n._('Lists of all devices')
  }],
  'demand' : [],
  'alias' : {
    'json':'j'
  },
  'describe' : {
    'json' : i18n._("Output in json format")
  },
  'url' : "/box/srv/1.1/admin/device/list",
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      response._table = common.createTableForDevices(response.list);
    }
    return cb(null, response);
  }
};
