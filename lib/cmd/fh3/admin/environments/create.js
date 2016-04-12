var log = require("../../../../utils/log");

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
    'autoDeployOnUpdate' : 'option used to setup automatic deployment to this environment when making source code changes within app.',
    'noAppend' : 'option used to create environment without adding it to the list of environments available for the domain.'
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
      autoDeployOnUpdate: params.autoDeployOnUpdate,
      noAppend: params.noAppend
    };

    if(params.noAppend) {
      log.warn("Warning! noAppend flag used. Environment will not appear in environment list. ");
    }
    return cb(null, request);
  }
};
