/* globals i18n */
var fhreq = require('../../../../../utils/request.js');
var fs = require('fs');
var util = require('util');
var async = require('async');
var _ = require('underscore');
var log = require('../../../../../utils/log');


/**
 *
 * Trying to export the submissions using asnyc Submission CSV export APIs.
 *
 * @param params
 * @param cb
 */
function tryExportAsync(params, cb) {
  var self = this;
  var url = self.urlAsyncStart(params);

  fhreq.POST(undefined, url, _.pick(params, 'fieldHeader', 'formId', 'projectId'), function(err, asyncStatus) {
    log.silly("export status", err);
    return cb(err, asyncStatus);
  });
}


/**
 *
 * Calling the old synchronous submission csv export endpoint.
 *
 * @param params
 * @param cb
 */
function doExportSync(params, cb) {
  params.url = this.url(params);
  params.method = this.method;

  fhreq.downloadFile(params, cb);
}


/**
 *
 * Utility function to poll for the export status until it has completed or errored out.
 *
 * @param params
 * @param cb
 */
function pollForExportStatus(params, cb) {
  var self = this;
  var url = self.urlAsyncStatus(params);
  var prevMessage;

  var csvExportPollInterval = setInterval(function() {
    fhreq.GET(undefined, url, function(err, asyncStatus) {
      asyncStatus = asyncStatus || {};
      if(err) {
        clearInterval(csvExportPollInterval);
        return cb(err);
      }

      if(asyncStatus.status === 'inprogress') {
        //Just updating the user on the status of the export

        //Only log out a progress message if it has changed. Otherwise it is too verbose.
        if(asyncStatus.message !== prevMessage) {
          prevMessage = asyncStatus.message;
          console.log(asyncStatus.message);
        }
      } else if(asyncStatus.status === 'complete') {
        //Export is complete, can now download the file.
        clearInterval(csvExportPollInterval);
        console.log("Submission CSV export complete. Downloading the exported file.");
        fhreq.downloadFile(_.defaults({url: asyncStatus.downloadUrl, method: "GET"}, params), cb);
      } else {
        //Submission export encountered an error, warn the user.
        clearInterval(csvExportPollInterval);
        log.warn("Error exporting submissions as CSV: " + asyncStatus.message);
        return cb(asyncStatus.message);
      }
    });
  }, 1000);
}


module.exports = {
  'desc': i18n._('Export A Set Of Submissions A Zip File Contain CSV Files'),
  'examples': [{
    cmd: 'fhc appforms environments submissions exportcsv --environment=<ID Of Environment To Export Submissions From> --fieldHeader=<name || fieldCode> --formId=<ID Of Form To Filter Submissions By> --projectId=<Project GUID To Filter Submissions By> --output=<File To Download Zip File To>.zip [--async]',
    desc: i18n._('Export A Set Of Submissions A Zip File Contain CSV Files')
  }],
  'demand': ['environment', 'output', 'fieldHeader'],
  'alias': {},
  'describe': {
    'environment': i18n._("ID Of Environment To Export Submissions From"),
    'output': i18n._("File To Download Zip File To. Must Have A .zip Extension."),
    'fieldHeader': i18n._("Headers To Use In The Exported CSV Files. Can Either Be name or fieldCode"),
    'formId': i18n._("ID Of Form To Filter Submissions By"),
    'projectId': i18n._("Project GUID To Filter Submissions By"),
    'async': i18n._("Use The Asynchronous Submission CSV Export Process. This is useful for large numbers of submissions. Requires MBaaS Version > 4.1.")
  },
  'url': function (params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/export";
  },
  'urlAsyncStart': function(params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/export/async";
  },
  'urlAsyncStatus': function(params) {
    return "/api/v2/mbaas/" + params.environment + "/appforms/submissions/export/status";
  },
  'customCmd': function (params, callback) {
    //Custom command to make a file request.

    var self = this;

    async.series([
      function checkFileDoesNotExist(cb) {

        //Should be a zip file.
        if (params.output.indexOf(".zip") === -1) {
          return cb(i18n._("Expected The Output File To Have A .zip Extension"));
        }

        fs.stat(params.output, function (err) {
          if (!err) {
            return cb(util.format(i18n._("The file at path %s already exists."), params.output));
          }

          return cb();
        });
      },
      function getSubmissionExport(cb) {
        if(params.async) {
          _.bind(tryExportAsync, self)(params, function(err, exportStatus){
            exportStatus = exportStatus || {};
            if(err){
              return cb(err);
            }

            //No error, but async Export is not available for the environment (MBaaS 4.0)
            //Then fall back to the synchronous version
            if(exportStatus.status === 'asyncunavailable') {
              return cb("Async submission CSV export is unavailable for this environment.");
            }

            //The export encountered an error, notify the user.
            if(exportStatus.status === 'error') {
              return cb(exportStatus.message || "The export process encountered an error. Please reset and try again.");
            }

            return _.bind(pollForExportStatus, self)(params, cb);
          });
        } else {
          return _.bind(doExportSync, self)(params, cb);
        }
      }
    ], callback);
  },
  'method': 'post'
};
