module.exports = { 
  'desc' : 'Update an mBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas update --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password> --decoupled=<bool>', desc : 'Updates an mbaas with id <mbaasId>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique mBaaS identifier',
    'url' : 'The hostname where your mBaaS exists',
    'servicekey' : 'Service key to authenticate the mBaaS',
    'username' : 'mBaaS Username',
    'password' : 'mBaaS Password',
    'decoupled':'flag them mbaas as decoupled'
  },
  'url' : function(params){
    return '/api/v2/mbaases/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
  
};
