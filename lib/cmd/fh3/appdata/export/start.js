"use strict";

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , readline = require('readline')
  , common = require('../../../../common');

module.exports = {
  'desc': 'Start a new data export job for the given application in the given environment',
  'examples': [{
    cmd: 'fhc addpata export start --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live',
    desc: 'Start a new data export job for the given application in the given environment'
  }],
  'demand': ['envId', 'appId'],
  'alias': {},
  'describe': {
    'envId': 'Environment id',
    'appId': 'Application id'
  },
  'preCmd': function (params, cb) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var question = [
      'Do you want to stop the application first?',
      'The application data might be outdated if you choose not to. (Y/n):'
    ].join('');

    rl.question(question, function (answer) {
      params.stopApp = shouldStopApp(answer);
      rl.close();
      return cb(null, params);
    });
  },
  'customCmd': function (params, cb) {
    var url = 'api/v2/appdata/' + params.envId + '/' + params.appId + '/data/export';

    common.doApiCall(fhreq.getFeedHenryUrl(), url, {
      stopApp: params.stopApp
    }, 'Error exporting data: ', function (err, result) {
      if (err) {
        return cb(err);
      }

      var info = [
        'Created a new export job with ID: ' + result,
        '. To check on the job status you can use the following command: \n',
        'fhc appdata export status --envId=' + params.envId,
        ' --appId=' + params.appId + ' --jobId=' + result
      ].join('');

      return cb(null, info);
    });
  }
};

// Evaluates the readline response
function shouldStopApp(text) {
  if (!text) {
    return true;
  }

  if (text === 'n' || text === 'no') {
    return false;
  }

  return true;
}
