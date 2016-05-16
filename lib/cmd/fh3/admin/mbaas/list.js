/* globals i18n */
var common = require('../../../../common.js');

module.exports = {
  'desc': i18n._('Lists available MBaaSes.'),
  'examples': [{
    cmd: 'fhc admin mbaas list ',
    desc: i18n._('Lists available MBaaSes')
  }],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': '/api/v2/mbaases',
  'method': 'get',
  'postCmd': function(params, cb) {
    params._table = common.createTableForMbaasTargets(params);
    return cb(null, params);
  }
};
