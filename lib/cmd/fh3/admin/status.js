/* globals i18n */
var common = require('../../../common.js');
module.exports = {
  'desc' : i18n._('Check status of this domain/millicore'),
  'examples' :
  [{
    cmd : 'fhc admin status',
    desc : i18n._('Check status of this domain/millicore')
  },{
    cmd : 'fhc admin status --json',
    desc : i18n._('Check status of this domain/millicore with the output as json')
  }],
  'demand' : [],
  'alias' : {
    'json' : 'j',
    0 : 'json'
  },
  'describe' : {
    'json' : i18n._('Output of this command in json format')
  },
  'perm' : "cluster/reseller/customer:read",
  'url' : '/box/api/status',
  'method' : 'get',
  'postCmd': function(argv, params, cb) {
    params._table = common.createTableForStatus(params);
    return cb(null, params);
  }
};