"use strict";

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , common = require('../../../../common');

module.exports = {
  'desc': 'List all current and historic export jobs given an application and environment id',
  'examples': [{
    cmd: 'fhc addpata export list --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live',
    desc: 'List all current and historic export jobs given an application and environment id'
  }],
  'demand': ['envId', 'appId'],
  'alias': {},
  'describe': {
    'envId': 'Environment id',
    'appId': 'Application id'
  },
  'method': 'get',
  'url': function (params) {
    return 'api/v2/appdata/' + params.envId + '/' + params.appId + '/data/export';
  },
  'postCmd': function (params, cb) {
    params._table = common.createTableForAppData(params);
    return cb(null, params);
  }
};
