var common = require('../../../../common.js');

module.exports = {
  'desc': 'Lists available environments.',
  'examples': [{
    cmd: 'fh admin environments list ',
    desc: 'Lists available environments'
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
