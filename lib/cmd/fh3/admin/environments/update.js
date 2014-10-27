module.exports = { 
  'usage' : 'Update an environments.',
  'examples' : [{ cmd : 'fhc admin environments update --id=<environment id> --label=<label> --targets=<mbaasTargetId1>,<mbaasTargetId2>', desc : 'Update an environment by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment',
    'label' : 'A label describing your environment',
    'targets' : 'Comma separated list of mBaaS Target hostnames'
  },
  'url' : function(params){
    return '/api/v2/environments/' + params._id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb){
    var targets = params.targets.split(',');
    return cb(null, {
      _id : params.id, 
      label : params.label, 
      targets : targets, 
      autoDeployOnCreate : params.autoDeployOnCreate,
      autoDeployOnUpdate : params.autoDeployOnUpdate
    });
  }
  
};
