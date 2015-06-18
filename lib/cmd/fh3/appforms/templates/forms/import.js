
module.exports = {
  'desc' : 'Imports A Single Form Template.',
  'examples' : [{ cmd : 'fhc appforms templates forms import --id=<Template ID> --name=<Name Of New Imported Form> --description=<Description For New Form>', desc : 'Imports A Single Form Template.'}],
  'demand' : ['id', 'name'],
  'alias' : {},
  'describe' : {
    'id': "Form Template ID To Import",
    'name': "New Name For Imported Form",
    'description': "Description For Imported Form"
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/forms/" + params.id + "/import";
  },
  'method' : 'post'
};
