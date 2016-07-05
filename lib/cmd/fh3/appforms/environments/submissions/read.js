/* globals i18n */
module.exports = {
  'desc': i18n._('Read A Single Submission'),
  'examples': [{
    cmd: 'fhc appforms environments submissions list --environment=<ID Of Environment To List Submissions> --id=<Submission ID>',
    desc: i18n._('Read A Single Submission')
  }],
  'demand': ['environment', 'id'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID Of Environment To List Forms"),
    'id': i18n._("Submission ID")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/" + params.id;
  },
  'method': 'get'
};
