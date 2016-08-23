/* globals i18n */

var mbaasTokenCheck = require("../../../../utils/mbaas-token-check");

module.exports = {
  'desc' : i18n._('Update an environments.'),
  'examples' : [{ cmd : 'fhc admin environments update --id=<environment id> --label=<label> --target=<mbaasTargetId> --token=<token>', desc : i18n._('Update an environment by id')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your environment'),
    'label' : i18n._('A label describing your environment'),
    'target' : i18n._('unique identifier for an existing MBaaS Target'),
    'token': i18n._('OpenShift token required to create the environment project')
  },
  'url' : function(params) {
    return '/api/v2/environments/' + params.id;
  },
  'method' : 'put',
  'preCmd' : function(params, cb) {
    var request = {
      id : params.id, // used in the url function, but discarded from body SS
      label : params.label,
      target : params.target,
      token: params.token,
      autoDeployOnCreate : params.autoDeployOnCreate,
      autoDeployOnUpdate : params.autoDeployOnUpdate
    };

    return mbaasTokenCheck.check(request, cb);
  }
};
