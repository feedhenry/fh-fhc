/* globals i18n */

"use strict";

var fs = require('fs')
  , _ = require('underscore')
  , fhreq = require('../../../../utils/request.js')
  , async = require('async')
  , ProgressBar = require('progress')
  , common = require('../../../../common');

var POLL_INTERVAL = 2000;
var MIN_INTERVAL = 100;
var EXIT_KEYS = ['q', 'Q'];
var STATUS_FAILED = 'failed';

/**
 * Read progress information by calling the `read` endpoint to get the
 * job definition. Progress information is included there:
 * - step: current export job step
 * - totalSteps: total export steps
 */
function readProgress(params, cb) {
  var url = 'api/v2/appdata/' + params.envId + '/' + params.appId + '/export/data/' + params.jobId;
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, 'Error reading progress', cb);
}

/**
 * Update the progressbar if possible. Don't use `bar#tick` as that will not
 * set the current progress but add the new valud to the current progress.
 */
function printout(data, bar) {
  if (bar && data.totalSteps && data.step >= 0) {
    bar.update(data.step / data.totalSteps);
  } else {
    /* eslint disable-next-line no-console */
    console.log(i18n._('No progress information in response'));
  }
}

/**
 * Get a sane poll interval (use the default one if the user did not provide
 * one)
 */
function getPollInterval(params) {
  if (params.interval && _.isNumber(params.interval)) {
    var interval = params.interval;
    return interval >= MIN_INTERVAL ? interval : POLL_INTERVAL;
  } else {
    return POLL_INTERVAL;
  }
}

module.exports = {
  'desc': i18n._('Poll for job status'),
  'examples': [{
    cmd: [
      'fhc addpata export status --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --jobId=5731da1dd3e2b283203c4054'
    ].join(''),
    desc: i18n._('Poll for job status')
  }],
  'demand': ['envId', 'appId', 'jobId'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id'),
    'jobId': i18n._('Export job id'),
    'interval': i18n._('Polling interval in milliseconds (default is 2000)')
  },
  'method': 'get',
  'customCmd': function (params, cb) {
    var bar = null, poller = null;

    function cleanupAndExit(err) {
      if (poller) {
        clearInterval(poller);
      }
      return cb(err);
    }

    // Need to use `console#log` here until we introduce some other logging or outpur
    // framework to fhc
    /* eslint disable-next-line no-console */
    console.log(i18n._('Polling job progress. Press `q` to quit'));

    function getProgressBar(job) {
      if (bar === null && job.totalSteps) {
        bar = new ProgressBar(i18n._('Job progress:') + ' [:bar] :current/:total :percent :elapseds :etas', {
          total: job.totalSteps
        });
      }
      return bar;
    }

    function onInterval() {
      readProgress(params, function (err, job) {
        if (err) {
          return cleanupAndExit(err);
        }

        // supercore sends the actual result in the `data` field
        job = job.data;

        // Don't wait for failed jobs
        if (job.status === STATUS_FAILED) {
          return cleanupAndExit(new Error(i18n._("Cannot query progress: Job has failed")));
        }

        printout(job, getProgressBar(job));

        if (bar && bar.complete) {
          return cleanupAndExit();
        }
      });
    }

    // To circumvent the initial delay
    onInterval();
    poller = setInterval(onInterval, getPollInterval(params));

    // Raw mode is required to flush stdin without
    // pressing return
    process.stdin.setRawMode(true);
    process.stdin.on('readable', function () {
      var chunk = process.stdin.read();

      // `stdin#read` can return null
      if (chunk) {
        var letter = chunk.toString();
        if (EXIT_KEYS.indexOf(letter) >= 0) {
          return cleanupAndExit();
        }
      }
    });
  }
};
