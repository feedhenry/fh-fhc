/* globals i18n */
var common = require("../../../common");

module.exports = {
  'desc' : i18n._('List services'),
  'examples' :
  [{
    cmd : 'fhc services list',
    desc : i18n._('List all services')
  }],
  'demand' : [],
  'alias' : {
    'json' : 'j',
    0 : 'json'
  },
  'describe' : {
    'json' : i18n._('Output into json format')
  },
  'url' : 'box/api/connectors/',
  'method' : 'get',
  'postCmd' : function(argv, params, cb) {
    if (!argv.json) {
      params._table = common.createTableForProjects(params);
    }
    return cb(null, params);
  }
};