
module.exports = {
  'desc' : 'Imports A Single Theme Template.',
  'examples' : [{ cmd : 'fhc appforms templates themes import --id=<Template ID> --name=<Name Of New Imported Theme> --description=<Description For New Theme>', desc : 'Imports A Single Theme Template.'}],
  'demand' : ['id', 'name'],
  'alias' : {},
  'describe' : {
    'id': "Theme Template ID To Import",
    'name': "New Name For Imported Theme",
    'description': "Description For Imported Theme"
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/themes/" + params.id + "/import";
  },
  'method' : 'post'
};
