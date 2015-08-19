
module.exports = {
  'desc' : 'Undeploy A Single Form To An Environment',
  'examples' : [{ cmd : 'fhc appforms environments forms undeploy --id=<ID Of Form To Undeploy> --environment=<ID Of Environment To Deploy Forms>', desc : 'Deploy A Single Form To An Environment'}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'id': "ID Of Form To Undeploy",
    'environment': "ID Of Environment To Undeploy Form From"
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id;
  },
  'method' : 'delete'
};