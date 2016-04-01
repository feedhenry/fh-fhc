/* globals i18n */

module.exports = {
  'desc' : i18n._('Delete A Submission'),
  'examples' : [{ cmd : 'fhc appforms environments submissions delete --environment=<Environment Id> --id=<Submission Id> ', desc : i18n._('Delete A Submission')}],
  'demand' : ['environment'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("Environment ID"),
    'id': i18n._("Submission ID")
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id;
  },
  'method' : 'delete'
};
