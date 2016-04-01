/* globals i18n */

module.exports = {
  'desc' : i18n._('Read A Single Form From An Environment.'),
  'examples' : [{ cmd : 'fhc appforms environments forms read --environment=<Environment To Read The Form From> --id=<ID Of Form To Read>', desc : i18n._('Read A Single Form')}],
  'demand' : ['id', 'environment'],
  'alias' : {},
  'describe' : {
    'id': i18n._("ID Of Form To Read"),
    'environment': i18n._("Environment To Read Form From")
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/forms/" + params.id;
  },
  'method' : 'get'
};
