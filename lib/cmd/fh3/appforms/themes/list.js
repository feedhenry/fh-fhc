/* globals i18n */

module.exports = {
  'desc' : i18n._('Lists All Themes.'),
  'examples' : [{ cmd : 'fhc appforms themes list', desc : i18n._('Lists All Themes.')}],
  'demand' : [],
  'alias' : {},
  'describe' : {
  },
  'url' : "/api/v2/appforms/themes",
  'method' : 'get'
};
