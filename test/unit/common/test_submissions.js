var assert = require('assert');
var submissions = require('cmd/common/submissions.js');
var submissionsNock = require('test/fixtures/forms/submissions.js');

module.exports = {
  setUp : function(done){
    return done();
  },
  "test submission list": function(done){
    submissions({_ : ['list']}, function(err, submissionResponse){
      assert.ok(!err);
      assert.ok(submissionResponse.statusCode === 200);
      assert.ok(submissionResponse.submissions);
      assert.ok(submissionResponse.submissions.length === 1);

      //Field Values and data fields should be removed.
      assert.ok(!submissionResponse.submissions[0].formSubmittedAgainst.pages[0].fields[0].values);
      assert.ok(!submissionResponse.submissions[0].formSubmittedAgainst.pages[0].fields[0].data);

      var fileFieldData = submissionResponse.submissions[0].formFields[0].fieldValues[0];

      assert.ok(fileFieldData);

      //Checking the required file data is present.
      assert.ok(fileFieldData.url);
      assert.ok(fileFieldData.fileName);
      assert.ok(fileFieldData.fileType);
      assert.ok(fileFieldData.fileSize);

      //Checking that the above keys are the only ones added.
      assert.ok(Object.keys(fileFieldData).length === 4);
      return done();
    });
  },
  "test submission get": function(done){
    submissions({ _ : ['get', '5449109299e98c45145f8267'] }, function(err, submission){
      assert.ok(!err, err);

      assert.ok(submission.statusCode === 200);

      //Field Values and data fields should be removed.
      assert.ok(!submission.formSubmittedAgainst.pages[0].fields[0].values);
      assert.ok(!submission.formSubmittedAgainst.pages[0].fields[0].data);

      var fileFieldData = submission.formFields[0].fieldValues[0];

      assert.ok(fileFieldData);

      //Checking the required file data is present.
      assert.ok(fileFieldData.url);
      assert.ok(fileFieldData.fileName);
      assert.ok(fileFieldData.fileType);
      assert.ok(fileFieldData.fileSize);

      //Checking that the above keys are the only ones added.
      assert.ok(Object.keys(fileFieldData).length === 4);
      return done();
    });
  },
  tearDown : function(done){
    submissionsNock.done();
    return done();
  }
};
