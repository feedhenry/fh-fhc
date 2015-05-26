
module.exports = {
  'desc' : 'Mark A Pending Submission As Complete',
  'examples' : [{ cmd : 'fhc appforms environments submissions complete --environment=<Environment Id> --id=<Submission Id> ', desc : 'Mark A Pending Submission As Complete'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': "Environment Id",
    'id': "Submission Id"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/complete" ;
  },
  'method' : 'post'
};
