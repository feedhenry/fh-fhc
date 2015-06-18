
module.exports = {
  'desc' : 'Reads A Single Theme Template.',
  'examples' : [{ cmd : 'fhc appforms templates themes read --id=<Template ID>', desc : 'Reads A Single Theme Template.'}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': "Theme Template ID"
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/themes/" + params.id;
  },
  'method' : 'get'
};
