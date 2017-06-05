"use strict";
/* globals i18n */

var common = require('../../../../common');

module.exports = {
  'desc': i18n._('List all current and historic import jobs given an application and environment id'),
  'examples': [{
    cmd: 'fhc addpata import list --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live',
    desc: i18n._('List all current and historic import jobs given an application and environment id')
  }],
  'demand': ['envId', 'appId'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id')
  },
  'method': 'get',
  'url': function(params) {
    return 'api/v2/appdata/' + params.envId + '/' + params.appId + '/data/import';
  },
  'postCmd': function(argv, params, cb) {
    params._table = common.createTableForAppData(params);
    return cb(null, params);
  }
};
