/* globals i18n */
var common = require("../../../common");
var fhc = require("../../../fhc");
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Read a connection'),
  'examples' :
  [{
    cmd : 'fhc connections read --project=<project> --connection=<connection>',
    desc : i18n._('Read the <connection> of the <project>')
  }],
  'demand' : ['project','connection'],
  'alias' : {
    'project' : 'p',
    'connection' : 'c',
    0 : 'project',
    1 : 'connection'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'connection' : i18n._('Unique 24 character GUID of the connection')
  },
  'customCmd' : function(params,cb) {
    fhc.connections.list({project: params.project}, function(err, conns) {
      if (err) {
        return cb(err);
      }
      var conn = _.findWhere(conns, {guid: params.connection});
      if (!conn) {
        return cb(i18n._('Connection not found: ') + params.connection);
      }
      if (!params.json) {
        var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
        var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];
        params._table = common.createTableFromArray(headers, fields, [conn]);
      }
      return cb(null, params);
    });
  }
};