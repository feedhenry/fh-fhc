"use strict";
/* globals i18n */

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , async = require('async')
  , common = require('../../../../common');

module.exports = {
  'desc': i18n._('Return the whole job definition in JSON format'),
  'examples': [{
    cmd: [
      'fhc addpata import read --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --jobId=5731da1dd3e2b283203c4054'
    ].join(''),
    desc: i18n._('Return the whole job definition in JSON format')
  }],
  'demand': ['envId', 'appId', 'jobId'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id'),
    'jobId': i18n._('Import job id')
  },
  'method': 'get',
  'url': function (params) {
    return 'api/v2/appdata/' + params.envId + '/' + params.appId + '/import/data/' + params.jobId;
  }
};
