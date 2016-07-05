/* globals i18n */

"use strict";

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , readline = require('readline')
  , common = require('../../../../common');

module.exports = {
  'desc': i18n._('Start a new data export job for the given application in the given environment'),
  'examples': [{
    cmd: 'fhc addpata export start --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live',
    desc: i18n._('Start a new data export job for the given application in the given environment')
  }, {
    cmd: 'fhc addpata export start --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --stopApp',
    desc: i18n._('Start a new data export job and stop the app without asking')
  }, {
    cmd: 'fhc addpata export start --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --stopApp=n',
    desc: i18n._('Start a new data export job without stopping the app')
  }],
  'demand': ['envId', 'appId'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id'),
    'stopApp': i18n._("override the stop-application prompt")
  },
  'preCmd': function (params, cb) {
    if (params.stopApp) {
      params.stopApp = shouldStopApp(params.stopApp);
      return cb(null, params);
    }

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    var question = [
      i18n._('Do you want to stop the application first?'),
      i18n._('The application data might be outdated if you choose not to. (Y/n):')
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
    }, i18n._('Error exporting data: '), function (err, result) {
      if (err) {
        return cb(err);
      }

      var info = [
        i18n._('Created a new export job with ID: ') + result,
        i18n._('. To check on the job status you can use the following command: \n'),
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
