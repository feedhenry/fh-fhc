module.exports = { 
  'desc' : 'Update an environments.',
  'examples' : [{ cmd : 'fh admin environments update --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>', desc : 'Update an environment by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment',
    'label' : 'A label describing your environment',
    'targets' : 'Comma separated list of mBaaS Target hostnames'
  },
  'url' : function(params){
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){
    if (params.targets){
      params.targets = params.targets.split(',');
    }
    return cb(null, {
      id : params.id, // used in the url function, but discarded from body SS
      label : params.label, 
      targets : params.targets, 
      autoDeployOnCreate : params.autoDeployOnCreate,
      autoDeployOnUpdate : params.autoDeployOnUpdate
    });
  }
  
};
