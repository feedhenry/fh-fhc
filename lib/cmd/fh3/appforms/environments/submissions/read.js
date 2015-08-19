
module.exports = {
  'desc' : 'Read A Single Submission',
  'examples' : [{ cmd : 'fhc appforms environments submissions list --environment=<ID Of Environment To List Submissions> --id=<Submission ID>', desc : 'Read A Single Submission'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': "ID Of Environment To List Forms",
    'id': "Submission ID"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id;
  },
  'method' : 'get'
};
