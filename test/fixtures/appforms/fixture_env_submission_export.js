var nock = require('nock');
var fs = require('fs');
var _ = require('underscore');

var filePath = 'test/fixtures/appforms/test_file.json';
var mockSubmissionExportHost = "https://some.exported.file.location.com";
var mockSubmissionExportPath = "/somefileid";
var mockSubmissionExportDownloadUrl = mockSubmissionExportHost + mockSubmissionExportPath;
var baseUrl = 'https://apps.feedhenry.com';

var mockSubmission = {
  _id: "somesubmissionid",
  formId: "someformid",
  appEnvironment: "someenv",
  formFields: [{
    fieldId: "sometextfieldid",
    fieldValues: ["sometextval"]
  }],
  formSubmittedAgainst: {
    _id: "someformid",
    name: "Some Form",
    pages: [{
      _id: "somepageid",
      fields: [{
        _id: "sometextfieldid",
        type: "text"
      }]
    }]
  }
};

var envReplies = {
  list: function(){
    return {
      pages: 22,
      total: 4000,
      submissions: [mockSubmission]
    };
  },
  get: function(){
    return mockSubmission;
  },
  getFile: function(){
    return fs.createReadStream(filePath);
  },
  exportStatusInProgress: function() {
    return {
      status: 'inprogress',
      message: 'submission export in progress'
    };
  },
  exportStatusUnavailable: function() {
    return {
      status: 'asyncunavailable',
      message: 'Async CSV export is unavailable for this environment'
    };
  },
  exportStatusComplete: function () {
    return {
      status: 'complete',
      message: 'Submission CSV Export complete',
      downloadUrl: mockSubmissionExportDownloadUrl
    };
  }
};

module.exports = {
  getCSVExportAsyncMocks: function() {
    //APIs required to satisfy asynchronous submission CSV export
    return  nock(baseUrl)
      .post('/api/v2/mbaas/someenv/appforms/submissions/export/async')
      .reply(200, envReplies.exportStatusInProgress)
      .get('/api/v2/mbaas/someenv/appforms/submissions/export/status')
      .reply(200, envReplies.exportStatusComplete);
  },
  getCSVExportAsyncFileDownloadMocks: function() {
    //The download url for exported submissions
    return nock(mockSubmissionExportHost)
      .get(mockSubmissionExportPath)
      .reply(200, envReplies.getFile);
  },
  getCSVExportAsyncUnavailable: function() {
    return  nock(baseUrl)
      .post('/api/v2/mbaas/someenv/appforms/submissions/export/async')
      .reply(200, envReplies.exportStatusUnavailable);
  },
  getCSVExportSyncMocks: function() {
    //APIs required to satisfy synchronous submission CSV export
    return  nock(baseUrl)
      .post('/api/v2/mbaas/someenv/appforms/submissions/export')
      .reply(200, envReplies.getFile);
  }
};
