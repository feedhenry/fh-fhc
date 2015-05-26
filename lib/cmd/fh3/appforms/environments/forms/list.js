
module.exports = {
  'desc' : 'List All Forms Deployed To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments forms list --environment=<ID Of Environment To List Forms>', desc : 'List All Forms Deployed To An Environment'}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To List Forms"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms";
  },
  'method' : 'get'
};
