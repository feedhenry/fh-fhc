/* globals i18n */

module.exports = {
  'desc' : i18n._('Lists All Form Templates.'),
  'examples' : [{ cmd : 'fhc appforms templates forms list', desc : i18n._('Lists All Form Templates.')}],
  'demand' : [],
  'alias' : {},
  'describe' : {
  },
  'url' : "/api/v2/appforms/templates/forms",
  'method' : 'get'
};
