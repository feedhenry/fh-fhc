var _ = require('underscore');
var common = require('../../../../../common');

module.exports = {
  'desc': 'Filter Submissions By Form Or Project Id',
  'examples': [{
    cmd: 'fhc appforms environments submissions filter --environment=<Environment Id> [projectid=<Filter By Project ID>] [formid=<Filter By Form ID>]',
    desc: 'Filter Submissions By Form Or Project Id'
  }],
  'demand': ['environment', 'page', 'limit'],
  'alias': {},
  'describe': {
    'environment': "Environment ID",
    'projectid': "Filter By Project ID",
    'formid': "Filter By Form ID",
    'page': "Page number to list",
    'limit': "Number of submissions per page"
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/filter_submissions";
  },
  'preCmd': function (params, cb) {
    params.formId = params.formid;
    params.appId = params.projectid;

    return cb(undefined, _.omit(params, "formid", "projectid"));
  },
  'postCmd': function(submissionsResult, cb){
    submissionsResult = submissionsResult || {};
    var table = common.createTableForSubmissions(submissionsResult);
    var submissionsArray = submissionsResult.submissions;
    submissionsArray._table = table;
    cb(undefined, submissionsArray);
  },
  'method': 'post'
};
