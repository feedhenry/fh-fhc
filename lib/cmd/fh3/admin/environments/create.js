module.exports = { 
  'desc' : 'Creates an environment.',
  'examples' : [{ cmd : 'fhc admin environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>', desc : 'Creates an environment'}],
  'demand' : ['id', 'label', 'targets'],
  'alias' : {},
  'describe' : {
    'id' : 'Unique identifier for your environment',
    'label' : 'A label describing your environment',
    'targets' : 'Comma separated list of mBaaS Target hostnames'
  },
  'url' : '/api/v2/environments',
  'method' : 'post',
  'preCmd' : function(params, cb){
    var targets = params.targets.split(',');
    if(typeof params.autoDeployOnCreate === 'undefined') {
      params.autoDeployOnCreate = false;
    }
    if(typeof params.autoDeployOnUpdate === 'undefined') {
      params.autoDeployOnUpdate = false;
    }

    return cb(null, {
      _id : params.id, 
      label : params.label, 
      targets : targets, 
      autoDeployOnCreate : params.autoDeployOnCreate,
      autoDeployOnUpdate : params.autoDeployOnUpdate
    });
  }
};
