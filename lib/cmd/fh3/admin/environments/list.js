/* globals i18n */
var common = require('../../../../common.js');

module.exports = {
  'desc': i18n._('Lists available environments.'),
  'examples': [{
    cmd: 'fhc admin environments list ',
    desc: i18n._('Lists available environments')
  }],
  'demand': [],
  'alias': {},
  'describe': {},
  'url': '/api/v2/environments/all',
  'method': 'get',
  'postCmd': function(params, cb) {
    params._table = common.createTableForEnvironments(params);
    return cb(null, params);
  }
};
