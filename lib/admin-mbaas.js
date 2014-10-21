var restfulCommand = require('./restful-cmd'),
usage = "\nfhc admin-mbaas [list]"
              + "\nfhc admin-mbaas read --id=<mBaaS id>"
              + "\nfhc admin-mbaas create --id=<mBaaS id> --url=<mBaaS URL> --servicekey=<mBaaS Service Key>"
              + "\nfhc admin-mbaas update --id=<mBaaS id> [--url=<mBaaS URL>] [--servicekey=<mBaaS Service Key>]"
              + "\nfhc admin-mbaas delete --id=<mBaaS id>"

module.exports = restfulCommand({
  url : '/api/v2/mbaas',
  usage : usage,
  getCreateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'create', cb);
  },
  getUpdateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'update', cb);
  }
});

function _getCreateUpdateParams(ini, action, cb){
  var url = ini.get('url'),
  servicekey = ini.get('servicekey'),
  id = ini.get('id'),
  mBaaS = {};
  
  if (action === 'create' && (!url || !servicekey || !id)){
    return cb('Create operations need an id, url and servicekey');
  }
  mBaaS.url = url;
  mBaaS.servicekey = servicekey;  
  mBaaS._id = id;
  
  return cb(null, mBaaS);
}
