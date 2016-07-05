var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_env_submissions');
var appformsenvsubmissions = {
  list: genericCommand(require('cmd/fh3/appforms/environments/submissions/list')),
  read: genericCommand(require('cmd/fh3/appforms/environments/submissions/read')),
  complete: genericCommand(require('cmd/fh3/appforms/environments/submissions/complete')),
  update: genericCommand(require('cmd/fh3/appforms/environments/submissions/update')),
  create: genericCommand(require('cmd/fh3/appforms/environments/submissions/create')),
  delete: genericCommand(require('cmd/fh3/appforms/environments/submissions/delete')),
  filter: genericCommand(require('cmd/fh3/appforms/environments/submissions/filter'))
};

var page = 1;
var limit = 10;

module.exports = {
  'test appforms-submissions list': function (cb) {
    appformsenvsubmissions.list({environment: "someenv", page: page, limit: limit}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data._table, "Expected A Table Of Submissions");
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions filter': function (cb) {
    appformsenvsubmissions.filter({environment: "someenv", formid: "someformid", projectid: "someformproject", page: page, limit: limit}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data._table, "Expected A Table Of Submissions");
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions read': function (cb) {
    appformsenvsubmissions.read({environment: "someenv", id: "somesubmissionid"}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions complete': function (cb) {
    appformsenvsubmissions.complete({environment: "someenv", id: "somesubmissionid"}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions create': function (cb) {
    appformsenvsubmissions.create({
      environment: "someenv",
      submissiondata: "test/fixtures/appforms/fixture_submission.json"
    }, function (err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions delete': function (cb) {
    appformsenvsubmissions.delete({environment: "someenv", id: "somesubmissionid"}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions update': function (cb) {
    appformsenvsubmissions.update({
      environment: "someenv",
      id: "somesubmissionid",
      submissiondata: "test/fixtures/appforms/fixture_submission.json"
    }, function (err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
