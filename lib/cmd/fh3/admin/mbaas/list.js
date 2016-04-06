var common = require('../../../../common.js');

module.exports = {
  'desc': 'Lists available MBaaSes.',
  'examples': [{
    cmd: 'fhc admin mbaas list ',
    desc: 'Lists available MBaaSes'
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