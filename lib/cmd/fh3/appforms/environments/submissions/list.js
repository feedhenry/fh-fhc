var common = require('../../../../../common');

module.exports = {
  'desc': 'List All Submissions Deployed To An Environment',
  'examples': [{
    cmd: 'fhc appforms environments submissions list --environment=<ID Of Environment To List Submissions>',
    desc: 'List All Submissions Deployed To An Environment'
  }],
  'demand': ['environment', 'page', 'limit'],
  'alias': {},
  'describe': {
    'environment': "ID Of Environment To List Forms",
    'page': "Page number to list",
    'limit': "Number of submissions per page"
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions?page=" + params.page + "&limit=" + params.limit;
  },
  'method': 'get',
  'postCmd': function(submissionsResult, cb){
    submissionsResult = submissionsResult || {};
    var table = common.createTableForSubmissions(submissionsResult);
    var submissionsArray = submissionsResult.submissions;
    submissionsArray._table = table;
    cb(undefined, submissionsArray);
  }
};
