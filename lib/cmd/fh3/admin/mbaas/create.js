module.exports = { 
  'desc' : 'Creates an mBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>', desc : 'Creates an environment'}],
  'demand' : ['id', 'url', 'username'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your mBaaS',
    'url' : 'The hostname where your mBaaS exists',
    'type' : 'The type of mBaaS you are creating - OpenShift or FeedHenry',
    'username' : 'mBaaS Username',
    'password' : '(FeedHenry type only) mBaaS Password',
    'servicekey' : '(FeedHenry type only) Service key to authenticate the mBaaS',
    'bearerToken' : '(OpenShift type only) oAuth bearer token',
    'privateKey' : '(OpenShift type only) Private keypair part for communicating with OpenShift'
   },
  'url' : '/api/v2/mbaases',
  'method' : 'post',
  'preCmd' : function(params, cb){
    params.type = params.type.toLowerCase();
    if (params.type === 'openshift' && (!params.privateKey || !params.bearerToken)){
      return cb('OpenShift mbaas types require a Private Key and Bearer Token ')
    }else if (params.type === 'feedhenry' && (!params.servicekey || !params.password)){
      return cb('FeedHenry mbaas types require a service key and password')
    }
    params._id = params.id;
    delete params.id;
    delete params._;
    delete params.$0;
    return cb(null, params);
  }
  
};
