module.exports = {
  'desc' : 'Get a new bearer token for an mbaas',
  'examples' : [{ cmd : 'fhc admin mbaas bearertoken --username=<user@host.tld>, --password<userpassword> --url=<openshiftURL> --mbaasid=<mbaasid>', desc : 'Gets a new bearer token'}],
  'demand' : ['username', 'password', 'url', 'mbaasid'],
  'alias' : {},
  'describe' : {
    'url' : 'The host where your MBaaS exists',
    'username' : 'MBaaS username',
    'password' : 'MBaaS password',
    'mbaasid': 'The id for the MBaaS'
  },
  'url' : function(argv) {
    return '/api/v2/mbaases/' + argv.mbaasid + '/regenerate_keys';
  },
  'method' : 'post',
  'preCmd' : function(params, cb){
    params._id = params.id;
    delete params.id;
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
};
