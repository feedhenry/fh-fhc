
module.exports = {
  'desc' : 'Delete A Submission',
  'examples' : [{ cmd : 'fhc appforms environments submissions delete --environment=<Environment Id> --id=<Submission Id> ', desc : 'Delete A Submission'}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': "Environment ID",
    'id': "Submission ID"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id;
  },
  'method' : 'delete'
};
