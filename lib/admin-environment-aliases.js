var restfulCommand = require('./restful-cmd'),
usage = "\nfhc admin-environment-aliases [list]"
      + "\nfhc admin-environment-aliases read --id=<environment alias id>"
      + "\nfhc admin-environment-aliases create --environment=<environment id> --environmentAlias=<environment id alias> --environmentLabelAlias=<environment label alias>"
      + "\nfhc admin-environment-aliases update --id=<environment alias id> [--environment=<environment id>] [--environmentAlias=<environment id alias>] [--environmentLabelAlias=<environment label alias>]"
      + "\nfhc admin-environment-aliases delete --id=<environment alias id>";
              
module.exports = restfulCommand({
  url : '/api/v2/environmentaliases',
  usage : usage,
  getCreateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'create', cb);
  },
  getUpdateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'update', cb);
  }
});

function _getCreateUpdateParams(ini, action, cb){
  var environmentId = ini.get('environment');
  var environmentAlias = ini.get('environmentAlias');
  var environmentLabelAlias = ini.get('environmentLabelAlias');
  
  if (action === 'create' && (!environmentId || !environmentAlias || !environmentLabelAlias)){
    return cb('Create operations need an environment, environmentAlias and environmentLabelAlias');
  }

  var alias = {};
  if(environmentId){
    alias.environmentId = environmentId;
  }
  if(environmentAlias){
    alias.environmentIdAlias = environmentAlias;
  }
  if(environmentLabelAlias){
    alias.environmentLabelAlias = environmentLabelAlias
  }
  
  return cb(null, alias);
}
