/* globals i18n */

module.exports = {
  'desc' : i18n._('Lists All Theme Templates.'),
  'examples' : [{ cmd : 'fhc appforms templates themes list', desc : i18n._('Lists All Theme Templates.')}],
  'demand' : [],
  'alias' : {},
  'describe' : {
  },
  'url' : "/api/v2/appforms/templates/themes",
  'method' : 'get'
};
