/* globals i18n */
var common = require('../../../common.js');
var _ = require('underscore');
var fhreq = require("../../../utils/request");
var util = require('util');

module.exports = {
  'desc' : i18n._('Operations on credential bundles'),
  'examples' :
  [{
    cmd : 'fhc credential list',
    desc : "List of all 'credential bundles' of this domain"
  },{
    cmd : 'fhc credential list --name=<name>',
    desc : "List of all 'credential bundles' with the <name> of this domain"
  },{
    cmd : 'fhc credential list --platform=<platform>',
    desc : "List of all 'credential bundles' with the <platform ios | Android> of this domain"
  },{
    cmd : 'fhc credential list --type=<type>',
    desc : "List of all 'credential bundles' with the <type distribution | release | debug> of this domain"
  },{
    cmd : 'fhc credential list --json',
    desc : "List of all 'credential bundles' of this domain with a json format"
  }],
  'demand' : [],
  'alias' : {
    'name': 'n',
    'type': 'n',
    'platform': 'p',
    'json': 'j'
  },
  'describe' : {
    'name' : i18n._("Name of the credential bundle."),
    'platform' : i18n._("Platform of the credential bundle which can be iOS or Android."),
    'type' : i18n._("Type of the credential bundle which can be distribution, release or debug."),
    'json' : i18n._("Output in json format")
  },
  'customCmd': function(params, cb) {
    common.doGetApiCall(fhreq.getFeedHenryUrl(), '/box/api/credentials', i18n._("Error listing credential bundles:"), function(err, credentials) {
      if (err) {
        return cb(err);
      }
      if (params.name) {
        credentials = filterByName(params, credentials);
        if (credentials.length < 1) {
          return cb(util.format(i18n._("Creadential bundle with the name '%s' not found."), params.name));
        }
      }
      if (params.type) {
        credentials = filterByType(params, credentials);
        if (credentials.length < 1) {
          return cb(util.format(i18n._("Creadential bundle with the type '%s' not found."), params.type));
        }
      }
      if (params.platform) {
        credentials = filterByPlatform(params, credentials);
        if (credentials.length < 1) {
          return cb(util.format(i18n._("Creadential bundle with the platform '%s' not found."), params.platform));
        }
      }
      if (!params.json) {
        credentials._table = common.createTableForCredentials(credentials);
      }
      return cb(null, credentials);
    });
  }
};

function filterByName(params, credentials) {
  return _.filter(credentials, function(item) {
    return item.bundleName.toUpperCase().indexOf(params.name.toUpperCase()) === 0;
  });
}

function filterByType(params, credentials) {
  return _.filter(credentials, function(item) {
    return item.bundleType.toUpperCase() === params.type.toUpperCase();
  });
}

function filterByPlatform(params, credentials) {
  return _.filter(credentials, function(item) {
    return item.platform.toUpperCase() === params.platform.toUpperCase();
  });
}