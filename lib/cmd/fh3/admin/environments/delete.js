/* globals i18n */
module.exports = {
  'desc' : i18n._('Delete an environment'),
  'examples' : [{ cmd : 'fhc admin environments delete --id=<environment id> --token=<token for deleting openshift environment>', desc : i18n._('Delete an environment by id')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id' : i18n._('Some unique identifier for your environment'),
    'token' : i18n._('OpenShift token required to delete an OpenShift environment project (can be obtained from OpenShift at /oauth/token/request)')
  },
  'url' : function(params) {
    return '/api/v2/environments/' + params.id;
  },
  'preCmd': function (argv, cb) {
    var params = {
      "id":argv.id
    };
    if (argv.token){
      params["openshift_api_token"]= argv.token;
      return cb(null,params);
    }
    return cb(null,params);
  },
  'method' : 'delete'
};
