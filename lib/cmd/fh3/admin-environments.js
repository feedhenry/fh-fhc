var restfulCommand = require('../../utils/restful-cmd'),
autoDeploy = "[--autoDeployOnCreate=<true|false>] [--autoDeployOnUpdate=<true|false>]",
usage = "\nfhc admin-environments [list]"
              + "\nfhc admin-environments read --id=<environment id>"
              + "\nfhc admin-environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2> " + autoDeploy
              + "\nfhc admin-environments update --id=<environment id> [--label=<label>] [--targets=<target1>,<target2>] " + autoDeploy
              + "\nfhc admin-environments delete --id=<environment id>";
              
module.exports = restfulCommand({
  url : '/api/v2/environments',
  usage : usage,
  getCreateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'create', cb);
  },
  getUpdateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'update', cb);
  }
});

function _getCreateUpdateParams(ini, action, cb){
  var label = ini.get('label'),
  targets = ini.get('targets'),
  id = ini.get('id'),
  environment = {};
  
  if (action === 'create' && (!label || !targets || !id)){
    return cb('Create operations need an id, label and targets');
  }
  // Targets are comma separated
  environment.targets = targets.split(',');
  environment._id = id;
  environment.label = label;  
  environment.autoDeployOnCreate = ini.get('autoDeployOnCreate');
  environment.autoDeployOnUpdate = ini.get('autoDeployOnUpdate');
  
  return cb(null, environment);
}
