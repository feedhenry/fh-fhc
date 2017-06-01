/* globals i18n */
var util = require('util');

module.exports = {
  'desc' : i18n._('Delete projects'),
  'examples' :
  [{
    cmd : 'fhc projects delete --project=<project>',
    desc : i18n._('Delete the <project>')
  }],
  'demand' : ['project'],
  'alias' : {
    'project':'p',
    'json':'j',
    0 : 'project'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'json' : i18n._("Output in json format")
  },
  'url' : function(argv) {
    return "box/api/projects/" + argv.project ;
  },
  'method' : 'delete',
  'postCmd': function(argv, response, cb) {
    if ( response && !argv.json) {
      return cb(null, util.format(i18n._("Project '%s' delete successfully"), response.title));
    }
    return cb(null, response);
  }
};