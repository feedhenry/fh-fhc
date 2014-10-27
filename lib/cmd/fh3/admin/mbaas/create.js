module.exports = { 
  'usage' : 'Creates an mBaaS.',
  'examples' : [{ cmd : 'fhc admin mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key> --username=<mBaaS User Name> --password=<mBaaS Password>', desc : 'Creates an environment'}],
  'demand' : ['id', 'url', 'servicekey', 'username', 'password'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your mBaaS',
    'url' : 'The hostname where your mBaaS exists',
    'servicekey' : 'Service key to authenticate the mBaaS',
    'username' : 'mBaaS Username',
    'password' : 'mBaaS Password'
  },
  'url' : '/api/v2/mbaases',
  'method' : 'post',
  'preCmd' : function(params, cb){
    params._id = params.id;
    delete params.id;
    delete params._;
    delete params['$0'];
    return cb(null, params);
  }
  
};
