module.exports = { 
  'desc' : 'Update an mBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas update --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>', desc : 'Updates an environment with id <mbaasId>'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique mBaaS identifier',
    'url' : 'The hostname where your mBaaS exists',
    'type' : 'The type of mBaaS you are creating - OpenShift or FeedHenry',
    'username' : 'mBaaS Username',
    'password' : '(FeedHenry type only) mBaaS Password',
    'servicekey' : '(FeedHenry type only) Service key to authenticate the mBaaS',
    'bearerToken' : '(OpenShift type only) oAuth bearer token',
    'privateKey' : '(OpenShift type only) Private keypair part for communicating with OpenShift'
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
