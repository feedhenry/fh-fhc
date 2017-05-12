/* globals i18n */

"use strict";

module.exports = {
  'desc': i18n._('Return the whole job definition in JSON format'),
  'examples': [{
    cmd: [
      'fhc addpata export read --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --jobId=5731da1dd3e2b283203c4054'
    ].join(''),
    desc: i18n._('Return the whole job definition in JSON format')
  }],
  'demand': ['envId', 'appId', 'jobId'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id'),
    'jobId': i18n._('Export job id')
  },
  'method': 'get',
  'url': function(params) {
    return 'api/v2/appdata/' + params.envId + '/' + params.appId + '/export/data/' + params.jobId;
  }
};
