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
  'customCmd' : function(params,cb) {
    common.listServices(function(err, services) {
      if (err) {
        return cb(err);
      }
      params._table = common.createTableForProjects(services);
      return cb(err, params);
    });
  }
};