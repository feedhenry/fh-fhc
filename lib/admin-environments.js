var restfulCommand = require('./restful-cmd'),
usage = "\nfhc admin-environments [list]"
              + "\nfhc admin-environments read --id=<environment id>"
              + "\nfhc admin-environments create --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>"
              + "\nfhc admin-environments update --id=<environment id> [--label=<label>] [--targets=<target1>,<target2>]"
              + "\nfhc admin-environments delete --id=<environment id>";
              
module.exports = restfulCommand({
  url : '/api/v2/environments',
  usage : usage,
  getCreateDocument : function(ini, cb){
    return _getCreateUpdateParams(ini, 'create', cb);
  },
  getUpdateDocument : function(){
    return _getCreateUpdateParams(ini, 'update', cb);
  }
});

function _getCreateUpdateParams(ini, action, cb){
  var label = ini.get('label'),
  targets = ini.get('targets'),
  environment = {};
  
  if (action === 'create' && (!label || !targets)){
    return cb('Create operations need a label and targets');
  }
  // Targets are comma separated
  if (targets){
    environment.targets = targets;
  }
  if (label){
    environment.label = label;  
  }
  
  return cb(null, environment);
}
