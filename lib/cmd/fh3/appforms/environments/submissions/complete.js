/* globals i18n */

module.exports = {
  'desc' : i18n._('Mark A Pending Submission As Complete'),
  'examples' : [{ cmd : 'fhc appforms environments submissions complete --environment=<Environment Id> --id=<Submission Id> ', desc : i18n._('Mark A Pending Submission As Complete')}],
  'demand' : ['environment', 'id'],
  'alias' : {},
  'describe' : {
    'environment': i18n._("Environment Id"),
    'id': i18n._("Submission Id")
  },
  'url' : function(params){
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id + "/complete" ;
  },
  'method' : 'post'
};
