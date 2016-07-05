/* globals i18n */

module.exports = {
  'desc' : i18n._('Reads A Single Theme Template.'),
  'examples' : [{ cmd : 'fhc appforms templates themes read --id=<Template ID>', desc : i18n._('Reads A Single Theme Template.')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': i18n._("Theme Template ID")
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/themes/" + params.id;
  },
  'method' : 'get'
};
