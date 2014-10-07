var restfulCommand = require('./restful-cmd'),
usage = "\nfhc admin-mbaas [list]"
              + "\nfhc admin-mbaas read --id=<mBaaS id>"
              + "\nfhc admin-mbaas create --url=<mBaaS URL> --key=<mBaaS Service Key>"
              + "\nfhc admin-mbaas update --id=<mBaaS id> [--url=<mBaaS URL>] [--key=<mBaaS Service Key>]"
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
  key = ini.get('key'),
  mBaaS = {};
  
  if (action === 'create' && (!url || !key)){
    return cb('Create operations need a url and key');
  }
  // Targets are comma separated
  if (url){
    mBaaS.url = url;
  }
  if (key){
    mBaaS.key = key;  
  }
  
  return cb(null, mBaaS);
}
