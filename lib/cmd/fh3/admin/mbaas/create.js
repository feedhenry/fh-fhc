module.exports = {
  'desc' : 'Creates an MBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas create --id=<MBaaS id> --url=<MBaaS URL> --servicekey=<MBaaS Service Key> --username=<MBaaS User Name> --password=<MBaaS Password> --decoupled=<bool> --size=<MBaaS Size> --label=<MBaaS label> --editable=<bool>', desc : 'Creates an mbaas'}],
  'demand' : ['id', 'url', 'servicekey', 'username', 'password'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your MBaaS',
    'url' : 'The hostname where your MBaaS exists',
    'servicekey' : 'Service key to authenticate the MBaaS',
    'username' : 'MBaaS Username',
    'password' : 'MBaaS Password',
    'decoupled':'flag them mbaas as decoupled',
    'size': 'The size of the MBaaS',
    'label': 'A label to apply to the MBaaS, defaults to id if not specified',
    'editable': 'Determines if the MBaaS target is editable for non-reseller users'
  },
  'url' : '/api/v2/mbaases',
  'method' : 'post',
  'preCmd' : function(params, cb) {
    params._id = params.id;
    if (!params.label) {
      params.label = params.id;
    }
    delete params.id;
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
};
