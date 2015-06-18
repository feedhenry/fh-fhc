
module.exports = {
  'desc' : 'Reads A Single Form Template.',
  'examples' : [{ cmd : 'fhc appforms templates forms read --id=<Template ID>', desc : 'Reads A Single Form Template.'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': "Form Template ID"
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/forms/" + params.id;
  },
  'method' : 'get'
};
