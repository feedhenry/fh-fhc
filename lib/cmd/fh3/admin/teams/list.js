/* globals i18n */

var common = require('../../../../common.js');
module.exports = {
  'desc' : i18n._('Lists teams.'),
  'examples' : [{ cmd : 'fhc admin teams list ', desc : i18n._('Lists available teams')}],
  'demand' : [],
  'alias' : {},
  'describe' : {},
  'url' : "api/v2/admin/teams",
  'method' : 'get',
  'postCmd': function (params, cb){
    params._table = common.createTableForTeams(params);
    return cb(null, params);
  }
};
