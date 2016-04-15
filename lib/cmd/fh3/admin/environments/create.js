module.exports = {
  'desc' : 'Creates an environment.',
  'examples' : [{ cmd : 'fhc admin environments create --id=<environment id> --label=<label> --target=<mbaasTargetId>',
    desc : 'Creates an environment'}],
  'demand' : ['id', 'label', 'target'],
  'alias' : {},
  'describe' : {
    'id' : 'Unique identifier for your environment',
    'label' : 'A label describing your environment',
    'target' : 'unique identifier for an existing MBaaS Target',
    'autoDeployOnCreate' : 'option used to setup automatic deployment to this environment when creating new project/app.',
    'autoDeployOnUpdate' : 'option used to setup automatic deployment to this environment when making source code changes within app.'
  },
  'url' : '/api/v2/environments',
  'method' : 'post',
  'preCmd' : function(params, cb) {
    if(typeof params.autoDeployOnCreate === 'undefined') {
      params.autoDeployOnCreate = false;
    }
    if(typeof params.autoDeployOnUpdate === 'undefined') {
      params.autoDeployOnUpdate = false;
    }
    if(typeof params.noAppend === 'undefined') {
      params.noAppend = false;
    }
    var request = {
      id: params.id,
      label: params.label,
      target: params.target,
      autoDeployOnCreate: params.autoDeployOnCreate,
      autoDeployOnUpdate: params.autoDeployOnUpdate
    };
    return cb(null, request);
  }
};
