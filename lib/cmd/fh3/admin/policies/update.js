/* globals i18n */
var common = require("../../../../common");
var fhreq = require("../../../../utils/request");
var fhc = require("../../../../fhc");
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
  'desc' : i18n._('Update Auth Policy'),
  'examples' :
    [{
      cmd : 'fhc admin policies update --id=<id> --type=<type> --checkUserExists=<true|false> --checkUserApproved=<true|false> --configurations=<configurations>',
      desc : i18n._('Update the values of <type>,<checkUserExists>,<checkUserApproved> and <config> of Auth Policy with <id>')
    }],
  'demand' : ['id'],
  'alias' : {
    'id' : 'i',
    'type' : 't',
    'checkUserExists' : 'ce',
    'checkUserApproved' : 'ca',
    'configurations' : 'c',
    'json' : 'j',
    0 : 'id',
    1 : 'type',
    2 : 'checkUserExists',
    3 : 'checkUserApproved',
    4 : 'config'
  },
  'describe' : {
    'id' : i18n._('The Auth Policy ID'),
    'type' : i18n._('The type of the Auth Policy'),
    'checkUserExists' : i18n._('Boolean <true|false> to check if exist the user before update.'),
    'checkUserApproved' : i18n._('Boolean <true|false> to check if the user is approved before update'),
    'configurations' : i18n._('A JSON Object corresponding to the policy type, e.g.')
      + i18n._('\n          for OAuth2: "{"clientId": "1234567890.apps.example.com",  "clientSecret": "Wfv8DQw80hhyaBqnW37x5R23", "provider": "GOOGLE"}"')
      + i18n._('\n          for LDAP: "{"authmethod": "simple", "url": "ldap://foo.example.com:389, "dn": "ou=people,dc=example,dc=com", "dn_prefix": "cn", "provider": "LDAP"}')
      + i18n._('\n                       authmethod can be one of: "simple", "DIGEST-MD5", "CRAM-MD5", or "GSSAPI"')
      + i18n._('\n          for MBAAS: "{"provider":"MBAAS","mbaas":"mqijsw3tgpn6htwmbbg27jl6","authEndpoint":"/test","defaultEnvironment":"dev"}"'),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    if (params.type && !validPolicyType(params.type)) {
      return cb(util.format(i18n._("'<type>' must be one of %s"), validPolicies.join(', ')));
    }

    if (params.configurations && typeof params.configurations === 'string') {
      try {
        params.configurations = JSON.parse(params.configurations);
      } catch (x) {
        return cb(i18n._("Invalid JSON object for the 'configurations' parameter:") + util.inspect(x));
      }
    }

    fhc.admin.policies.read({id:params.id, json:true}, function(err,data) {
      if (err) {
        return cb(err);
      }
      if (params.type) {
        data["policyType"] = params.type;
      }
      if (params.configurations) {
        data["configurations"] = params.configurations;
      }
      if (params.checkUserExists) {
        data["checkUserExists"] = params.checkUserExists;
      }
      if (params.checkUserApproved) {
        data["checkUserApproved"] = params.checkUserApproved;
      }

      common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/update", data, i18n._("Error updating policy: "), function(err, response) {
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