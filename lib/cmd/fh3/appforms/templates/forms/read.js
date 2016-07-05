/* globals i18n */

module.exports = {
  'desc' : i18n._('Reads A Single Form Template.'),
  'examples' : [{ cmd : 'fhc appforms templates forms read --id=<Template ID>', desc : i18n._('Reads A Single Form Template.')}],
  'demand' : ['id'],
  'alias' : {},
  'describe' : {
    'id': i18n._("Form Template ID")
  },
  'url' : function(params){
    return "/api/v2/appforms/templates/forms/" + params.id;
  },
  'method' : 'get'
};
