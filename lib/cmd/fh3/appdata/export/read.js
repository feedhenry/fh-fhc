"use strict";

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , async = require('async')
  , common = require('../../../../common');

module.exports = {
  'desc': 'Return the whole job definition in JSON format',
  'examples': [{
    cmd: [
      'fhc addpata export read --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --jobId=5731da1dd3e2b283203c4054'
    ].join(''),
    desc: 'Return the whole job definition in JSON format'
  }],
  'demand': ['envId', 'appId', 'jobId'],
  'alias': {},
  'describe': {
    'envId': 'Environment id',
    'appId': 'Application id',
    'jobId': 'Export job id'
  },
  'method': 'get',
  'url': function (params) {
    return 'api/v2/appdata/' + params.envId + '/' + params.appId + '/export/data/' + params.jobId;
  }
};
