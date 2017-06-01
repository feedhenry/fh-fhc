/* globals i18n */
module.exports = {
  'desc' : i18n._('Read projects'),
  'examples' :
  [{
    cmd : 'fhc projects read --project=<project>',
    desc : i18n._('Read the <project>')
  }],
  'demand' : ['project'],
  'alias' : {
    'project':'p',
    0 : 'project'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project')
  },
  'url' : function(argv) {
    return "box/api/projects/" + argv.project ;
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if ( !response && !argv.json) {
      return cb(null, i18n._("Project '%s' was not found") + argv.project);
    }
    return cb(null, response);
  }
};