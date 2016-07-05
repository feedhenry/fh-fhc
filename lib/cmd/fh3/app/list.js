/* globals i18n */
var common = require('../../../common.js');
module.exports = {
  'desc' : i18n._('Lists apps under a project.'),
  'examples' : [
    { cmd : 'fhc app list --project=1a2b3c', desc : i18n._('Passing project using a flag')},
    { cmd : 'fhc app list 1a2b3c', desc : i18n._('Passing project as an argument')}
  ],
  'demand' : ['project'],
  'alias' : {
    'project' : 'p',
    0 : 'project'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project you want to list apps in')
  },
  'url' : function(argv){
    return "box/api/projects/" + argv.project;
  },
  'method' : 'get',
  'postCmd' : function(params, cb) {
    params._table = common.createTableForProjectApps(params.guid, params.apps);
    return cb(null, params);
  }
};
