/* globals i18n */

module.exports = {
  'desc' : i18n._('Reset a submission CSV export for a single environment'),
  'examples' : [{ cmd : 'fhc appforms environments submissions csvExportReset --environment=<Environment Id> ', desc : i18n._('Reset a submission CSV export for a single environment')}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("Environment Id")
  },
  'url': function(params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/export/reset";
  },
  'method' : 'post'
};
