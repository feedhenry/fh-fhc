"use strict";
/* globals i18n */

var async = require('async');
var path = require('path');
var mime = require('mime');
var tar = require('tar');

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , readline = require('readline')
  , common = require('../../../../common');

/**
 * Checks that the passed in file is a tar file and is composed by only .gz files
 * @param filePath
 * @param cb
 */
function verifyTarFile(filePath, cb) {
  var wellFormed = true;

  fs.createReadStream(filePath)
    .pipe(tar.Parse())
    .on("entry", function (entry) {
      if (!/\.gz$/.test(entry.props.path)) {
        wellFormed = false;
      }
    })
    .on('error', function(err) {
      cb(err);
    })
    .on("end", function() {
      if (!wellFormed) {
        cb('Tar file is not well formed');
      } else {
        cb();
      }
    });
}

function retrieveUploadMetadata(envId, appId, filePath, cb) {
  var url = 'api/v2/appdata/' + envId + '/' + appId + '/data/import';

  fs.stat(filePath, function (err, stat) {
    if (err) {
      return cb(err);
    }

    var fields = {
      filename: path.basename(filePath),
      filesize: stat["size"]
    };
    // Get the jobID
    common.doApiCall(fhreq.getFeedHenryUrl(), url, fields, i18n._('Error importing data: '), function (err, jobData) {
      if (err) {
        return cb(err);
      }

      return cb(null, jobData);
    });
  });
}

function sendFile(filePath, jobData, cb) {
  var uploadUrl = jobData.url;

  fhreq.importUpload(filePath, uploadUrl, function(err) {
    if (err) {
      return cb(err);
    }

    cb(null, jobData.jobId);
  });
}

function startJob(envId, appId, filePath, cb) {
  async.waterfall([
    async.apply(verifyTarFile, filePath),
    async.apply(retrieveUploadMetadata, envId, appId, filePath),
    async.apply(sendFile, filePath)
  ], function(err, jobId) {
    cb(err, jobId);
  });
}

module.exports = {
  'desc': i18n._('Start a new data import job for the given application in the given environment'),
  'examples': [{
    cmd: 'fhc addpata import start --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --path=/my/import.tar',
    desc: i18n._('Start a new data import job for the given application in the given environment')
  }],
  'demand': ['envId', 'appId', 'path'],
  'alias': {},
  'describe': {
    'envId': i18n._('Environment id'),
    'appId': i18n._('Application id'),
    'path': i18n._('path to the file to be uploaded')
  },
  'customCmd' : function (params, cb) {
    startJob(params.envId, params.appId, params.path, function (err, jobId) {
      if (err) {
        return cb(err);
      }

      var info = [
        i18n._('Created a new import job with ID: ') + jobId,
        i18n._('. To check on the job status you can use the following command: \n'),
        'fhc appdata import status --envId=' + params.envId,
        ' --appId=' + params.appId + ' --jobId=' + jobId
      ].join('');

      return cb(null, info);
    });
  }
};
