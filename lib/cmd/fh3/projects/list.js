/* globals i18n */
var common = require('../../../common.js');
var _ = require('underscore');
var util = require('util');

module.exports = {
  'desc' : i18n._('List projects'),
  'examples' :
  [{
    cmd : 'fhc projects list',
    desc : "List of all projects of this domain"
  },{
    cmd : 'fhc projects list --authorEmail=<authorEmail>',
    desc : "List of all projects with the <authorEmail>"
  },{
    cmd : 'fhc projects list --json',
    desc : "List of all projects in json format"
  }, {
    cmd : 'fhc projects list --includeApps --json',
    desc : "List of all projects in json format and include app info"
  }],
  'demand' : [],
  'alias' : {
    'authorEmail': 'a',
    'includeApps': 'i',
    'json': 'j',
    0 : 'authorEmail'
  },
  'describe' : {
    'authorEmail' : i18n._("Email of the user author/owner of the project."),
    'json' : i18n._("Output in json format")
  },
  'url': function(params) {
    var includeApps = params.includeApps ? "true" : "false";
    return 'box/api/projects?apps=' + includeApps;
  },
  'method': 'get',
  'postCmd': function(params, response, cb) {
    if (params.authorEmail) {
      response = filterByAuthorEmail(params, response);
      if (response.length < 1) {
        return cb(util.format(i18n._("Not found projects with the authorEmail '%s' ."), params.authorEmail));
      }
    }
    if (!params.json) {
      response._table = common.createTableForProjects(response);
    }
    return cb(null, response);
  }
};

function filterByAuthorEmail(params, projects) {
  return _.filter(projects, function(item) {
    return item.authorEmail.toUpperCase().indexOf(params.authorEmail.toUpperCase()) === 0;
  });
}
