module.exports = {
  'desc' : 'Update an MBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas update --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label>', desc : 'Updates an mbaas with id <mbaasId>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique MBaaS identifier',
    'url' : 'The hostname where your MBaaS exists',
    'servicekey' : 'Service key to authenticate the MBaaS',
    'username' : 'MBaaS Username',
    'password' : 'MBaaS Password',
    'decoupled':'flag them mbaas as decoupled',
    'size': 'The size of the MBaaS',
    'label': 'A label to apply to the MBaaS'
  },
  'url' : function(params) {
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb) {
    delete params._;
    delete params.$0;
    return cb(null, params);
  }

};
