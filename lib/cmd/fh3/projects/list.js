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
    cmd : 'fhc projects list',
    desc : "List of all projects in json format"
  }],
  'demand' : [],
  'alias' : {
    'authorEmail': 'a',
    'json': 'j',
    0 : 'authorEmail'
  },
  'describe' : {
    'authorEmail' : i18n._("Email of the user author/owner of the project."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.listProjects(function(err, projs) {
      if (err) {
        return cb(err);
      }
      if (params.authorEmail) {
        projs = filterByAuthorEmail(params, projs);
        if (projs.length < 1) {
          return cb(util.format(i18n._("Not found projects with the authorEmail '%s' ."), params.authorEmail));
        }
      }
      if (!params.json) {
        projs._table = common.createTableForProjects(projs);
      }
      return cb(null, projs);
    });
  }
};

function filterByAuthorEmail(params, projects) {
  return _.filter(projects, function(item) {
    return item.authorEmail.toUpperCase().indexOf(params.authorEmail.toUpperCase()) === 0;
  });
}
