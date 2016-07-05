var nock = require('nock');
var fs = require('fs');
var _ = require('underscore');

var filePath = 'test/fixtures/appforms/test_file.json';

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
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .get('/api/v2/mbaas/someenv/appforms/submissions', '*')
  .query({
    page: 1,
    limit: 10
  })
  .reply(200, envReplies.list)
  .get('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid', '*')
  .reply(200, envReplies.get)
  .post('/api/v2/mbaas/someenv/appforms/submissions/export', '*')
  .reply(200, envReplies.getFile)
  .post('/api/v2/mbaas/someenv/appforms/submissions/search', '*')
  .reply(200, envReplies.list)
  .put('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid', '*')
  .reply(200, envReplies.get)
  .delete('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid', '*')
  .reply(200, envReplies.get)
  .get('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid/files/somefileid', '*')
  .reply(200, envReplies.get)
  .put('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid/fields/somefieldid/files/someexistingfileid', '*')
  .reply(200, envReplies.get)
  .post('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid/fields/somefieldid/files/somenewfileid', '*')
  .reply(200, envReplies.get)
  .post('/api/v2/mbaas/someenv/appforms/submissions', '*')
  .reply(200, envReplies.get)
  .post('/api/v2/mbaas/someenv/appforms/submissions/filter_submissions', '*')
  .reply(200, envReplies.list)
  .post('/api/v2/mbaas/someenv/appforms/submissions/somesubmissionid/complete', '*')
  .reply(200, envReplies.get);
