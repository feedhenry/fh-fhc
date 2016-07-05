/* globals i18n */

module.exports = {
  'desc' : i18n._('Creates an environment.'),
  'examples' : [{ cmd : 'fhc admin environments create --id=<environment id> --label=<label> --target=<mbaasTargetId>',
    desc : i18n._('Creates an environment')}],
  'demand' : ['id', 'label', 'target'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Unique identifier for your environment'),
    'label' : i18n._('A label describing your environment'),
    'target' : i18n._('unique identifier for an existing MBaaS Target'),
    'autoDeployOnCreate' : i18n._('option used to setup automatic deployment to this environment when creating new project/app.'),
    'autoDeployOnUpdate' : i18n._('option used to setup automatic deployment to this environment when making source code changes within app.')
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
