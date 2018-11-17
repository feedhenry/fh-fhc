/* globals i18n */
var common = require("../../../common");
var fhreq = require("../../../utils/request");

module.exports = {
  'desc' : i18n._('Create connections'),
  'examples' :
  [{
    cmd : 'fhc connections create --client=<client> --cloud=<cloud> --type=<type> --env=<env> --project=<project> --connection=<connection>',
    desc : i18n._('Create the <connection> for the <client> with the <type> and the <cloud> from the <project> deployed on the <env>')
  },{
    cmd : 'fhc connections create --client=<client> --cloud=<cloud> --type=<type> --env=<env> --project=<project>',
    desc : i18n._('Create a a new sequencially connection for the <client> with the <type> and the <cloud> from the <project> deployed on the <env>')
  }
  ],
  'demand' : ['client','cloud','type','env','project'],
  'alias' : {
    'client' : 'cli',
    'cloud' : 'clo',
    'type' : 't',
    'env' : 'e',
    'project' : 'p',
    'connection' : 'c',
    'json': 'j',
    0 : 'client',
    1 : 'cloud',
    2 : 'type',
    3 : 'env',
    4 : 'project',
    5 : 'connection'
  },
  'describe' : {
    'client' : i18n._('Unique 24 character GUID of the project'),
    'cloud' : i18n._('Unique 24 character GUID of the connection'),
    'type' : i18n._('"Client app type : [android, ios, html5]"'),
    'env' : i18n._('Unique 24 character GUID of the cloud application'),
    'project' : i18n._('Unique 24 character GUID of the cloud application'),
    'connection' : i18n._('Connection Tags must be in Semantic Version format, e.g. 0.0.1. See: http://semver.org'),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params,cb) {
    var url = '/box/api/connections/' ;
    params.type = params.type.toLowerCase();
    if ( params.type !== 'android' && params.type !== 'ios' && params.type !== 'html5' ) {
      return cb(i18n._('Invalid type of client app : ' + params.type));
    }
    var payload =  {
      clientApp: params.client,
      cloudApp: params.cloud,
      destination: params.type,
      environment: params.env,
      project: params.project,
      status: "ACTIVE"
    };

    if (params.connection) {
      payload.tag = params.connection;
    }

    fhreq.POST(fhreq.getFeedHenryUrl(), url, payload, function(err, con, raw, response) {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 201) {
        return cb(raw);
      }
      if (!params.json) {
        var headers = ['Id', 'Environment', 'Connection Tag', 'Platform', 'Client App', 'Cloud App', 'Build Type', 'Status'];
        var fields = ['guid', 'environment', 'tag', 'destination', 'clientApp', 'cloudApp', 'build', 'status'];
        con._table = common.createTableFromArray(headers, fields, [con]);
      }
      return cb(null, con);
    });
  }
};