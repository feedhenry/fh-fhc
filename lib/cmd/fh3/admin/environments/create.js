module.exports = { 
  'desc' : 'Creates an environments.',
  'examples' : [{ cmd : 'fhc admin environments create --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>', desc : 'Creates an environment'}],
  'demand' : ['id', 'label', 'targets'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment',
    'label' : 'A label describing your environment',
    'targets' : 'Comma separated list of mBaaS Target hostnames'
  },
  'url' : '/api/v2/environments',
  'method' : 'post',
  'preCmd' : function(params, cb){
    var targets = params.targets.split(',');
    return cb(null, {
      _id : params.id, 
      label : params.label, 
      targets : targets, 
      autoDeployOnCreate : params.autoDeployOnCreate || false,
      autoDeployOnUpdate : params.autoDeployOnUpdate || false
    });
  }
  
};
