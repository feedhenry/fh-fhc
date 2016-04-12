module.exports = {
  'desc' : 'Update an environments.',
  'examples' : [{ cmd : 'fhc admin environments update --id=<environment id> --label=<label> --target=<mbaasTargetId>', desc : 'Update an environment by id'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : 'Some unique identifier for your environment',
    'label' : 'A label describing your environment',
    'target' : 'unique identifier for an existing MBaaS Target'
  },
  'url' : function(params) {
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb) {
    return cb(null, {
      id : params.id, // used in the url function, but discarded from body SS
      label : params.label,
      target : params.target,
      autoDeployOnCreate : params.autoDeployOnCreate,
      autoDeployOnUpdate : params.autoDeployOnUpdate
    });
  }

};
