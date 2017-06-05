/* globals i18n */
var common = require("../../../common");
var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var _ = require('underscore');

module.exports = {
  'desc' : i18n._('Update connections'),
  'examples' :
  [{
    cmd : 'fhc connections update --project=<project> --connection=<connection> --app=<app>',
    desc : i18n._('Update the <app> of the <connection> from the <project> ')
  },
  {
    cmd : 'fhc connections update --project=<project> --connection=<connection> --app=<app> --env=<environment>',
    desc : i18n._('Update the <app> and <environment> of the <connection> from the <project> ')
  }
  ],
  'demand' : ['project','connection','app'],
  'alias' : {
    'project' : 'p',
    'connection' : 'c',
    'app' : 'a',
    'env' : 'e',
    0 : 'project',
    1 : 'connection',
    2 : 'app',
    3 : 'env'
  },
  'describe' : {
    'project' : i18n._('Unique 24 character GUID of the project'),
    'connection' : i18n._('Unique 24 character GUID of the connection'),
    'app' : i18n._('Unique 24 character GUID of the cloud application'),
    'env' : i18n._('Unique 24 character GUID of the environment')
  },
  'url' : function(argv) {
    return 'box/api/connections/' + argv.connection;
  },
  'method' : 'put',
  'customCmd' : function(params,cb) {
    fhc.connections.list({project: params.project}, function(err, conns) {
      if (err) {
        return cb(err);
      }
      var conn = _.findWhere(conns, {guid: params.connection});
      if (!conn) {
        return cb(i18n._('Connection not found: ') + params.connection);
      }
      conn.cloudApp = params.app;
      if ( params.env) {
        conn.environment = params.env;
      }
      var url = '/box/api/connections/' + params.connection;
      fhreq.PUT(fhreq.getFeedHenryUrl(), url, conn, function(err, con, raw, response) {
        if (err) {
          return cb(err);
        }
        if (response.statusCode !== 200) {
          return cb(raw);
        }
        if (!params.json) {
          var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
          var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];
          params._table = common.createTableFromArray(headers, fields, [con]);
        }
        return cb(null, params);
      });
    });
  }
};