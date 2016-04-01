/* globals i18n */
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Filter Submissions By Form Or Project Id'),
  'examples': [{
    cmd: 'fhc appforms environments submissions filter --environment=<Environment Id> [projectid=<Filter By Project ID>] [formid=<Filter By Form ID>]',
    desc: i18n._('Filter Submissions By Form Or Project Id')
  }],
  'demand': ['environment'],
  'alias': {},
  'describe': {
    'environment': i18n._("Environment ID"),
    'projectid': i18n._("Filter By Project ID"),
    'formid': i18n._("Filter By Form ID")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/filter_submissions";
  },
  'preCmd': function (params, cb) {
    params.formId = params.formid;
    params.appId = params.projectid;

    return cb(undefined, _.omit(params, "formid", "projectid"));
  },
  'method': 'post'
};
