/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");
var _ = require('underscore');
var util = require('util');

var validPolicies = [
  'OAUTH1',
  'OAUTH2',
  'LDAP',
  'OPENID',
  'FEEDHENRY',
  'MBAAS'
];

module.exports = {
  'desc' : i18n._('[DEPRECATED] Create Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies create --id=<id> --type=<type> --configurations=<configurations> --checkUserExists=<true|false> --checkUserApproved=<true|false>' ,
      desc : i18n._('[DEPRECATED] Create Auth Policy with <id>,<type>,<checkUserExists>,<checkUserApproved> and <config>')
    }],
  'demand' : ['id','type','configurations'],
  'alias' : {
    'id' : 'i',
    'type' : 't',
    'configurations' : 'c',
    'checkUserExists' : 'ce',
    'checkUserApproved' : 'ca',
    'json' : 'j',
    0 : 'id',
    1 : 'type',
    2 : 'configurations',
    3 : 'checkUserExists',
    4 : 'checkUserApproved'
  },
  'describe' : {
    'id' : i18n._('The Auth Policy ID'),
    'type' : i18n._('The type of the Auth Policy'),
    'configurations' : i18n._('A JSON Object corresponding to the policy type, e.g. ')
    + i18n._('\n          for OAuth2: "{"clientId": "1234567890.apps.example.com",  "clientSecret": "Wfv8DQw80hhyaBqnW37x5R23", "provider": "GOOGLE"}"')
    + i18n._('\n          for LDAP: "{"authmethod": "simple", "url": "ldap://foo.example.com:389, "dn": "ou=people,dc=example,dc=com", "dn_prefix": "cn", "provider": "LDAP"}')
    + i18n._('\n                       authmethod can be one of: "simple", "DIGEST-MD5", "CRAM-MD5", or "GSSAPI"')
    + i18n._('\n          for MBAAS: "{"provider":"MBAAS","mbaas":"mqijsw3tgpn6htwmbbg27jl6","authEndpoint":"/test","defaultEnvironment":"dev"}"'),
    'checkUserExists' : i18n._('Boolean <true|false> to check if exist the user.'),
    'checkUserApproved' : i18n._('Boolean <true|false> to check if the user is approved'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    if (params.type && !validPolicyType(params.type)) {
      return cb(util.format(i18n._("'<type>' must be one of %s"), validPolicies.join(', ')));
    }

    var configurationsJSON = {};
    try {
      configurationsJSON = JSON.parse(params.configurations);
    } catch (e) {
      return cb(i18n._("Invalid JSON object for the 'configurations' parameter"));
    }

    var data = {
      policyId:params.id,
      policyType:params.type,
      configurations:  configurationsJSON,
      checkUserExists:params.checkUserExists || "false",
      checkUserApproved:params.checkUserApproved || "false",
      users:[]
    };

    common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/create", data, i18n._("Error updating policy: "), function(err, response) {
      if (err) {
        return cb(err);
      }
      if (!params.json && response.status === "ok") {
        var headers = ['GUID', 'Policy Id','Type', 'checkUserApproved', 'checkUserExists'];
        var fields = ['guid', 'policyId','policyType', 'checkUserApproved', 'checkUserExists'];
        response._table = common.createTableFromArray(headers, fields, [response]);
      }
      return cb(null, response);
    });
  }
};

/**
 * @param  {string} type Policy Type
 * @return {boolean}
 */
function validPolicyType(type) {
  return _.contains(validPolicies, type);
}