
module.exports = {
  'desc' : 'List All Submissions Deployed To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments submissions list --environment=<ID Of Environment To List Submissions>', desc : 'List All Submissions Deployed To An Environment'}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To List Forms"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions";
  },
  'method' : 'get'
};
