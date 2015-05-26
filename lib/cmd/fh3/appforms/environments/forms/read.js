
module.exports = {
  'desc' : 'Read A Single Form From An Environment.',
  'examples' : [{ cmd : 'fhc appforms environments forms read --environment=<Environment To Read The Form From> --id=<ID Of Form To Read>', desc : 'Read A Single Form'}],
  'demand' : ['id', 'environment'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Form To Read",
    'environment': "Environment To Read Form From"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id;
  },
  'method' : 'get'
};
