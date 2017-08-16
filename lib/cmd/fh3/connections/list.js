/* globals i18n */
var common = require("../../../common");

module.exports = {
  'desc' : i18n._('List connections'),
  'examples' :
  [{
    cmd : 'fhc connections list --project=<project>',
    desc : i18n._('List all connections of the <project>')
  }],
  'demand' : ['project'],
  'alias' : {
    'project' : 'p',
    0 : 'project'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project')
  },
  'url' : function(argv) {
    return "box/api/projects/" + argv.project + '/connections';
  },
  'method' : 'get',
  'postCmd': function(argv, response, cb) {
    if (!argv.json) {
      var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
      var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];
      response._table = common.createTableFromArray(headers, fields, response);
    }
    return cb(null, response);
  }
};