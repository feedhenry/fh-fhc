
module.exports = {
  'desc' : 'Deploy A Single Form To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments forms deploy --id=<ID Of Form To Deploy> --environment=<ID Of Environment To Deploy Forms>', desc : 'Deploy A Single Form To An Environment'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Form To Deploy",
    'environment': "ID Of Environment To Deploy To"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id + "/deploy";
  },
  'method' : 'post'
};