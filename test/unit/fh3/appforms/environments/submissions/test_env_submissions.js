var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_env_forms');
var appformsenvsubmissions = {
  list: genericCommand(require('cmd/fh3/appforms/environments/submissions/list')),
  read: genericCommand(require('cmd/fh3/appforms/environments/submissions/read')),
  complete: genericCommand(require('cmd/fh3/appforms/environments/submissions/complete')),
  update: genericCommand(require('cmd/fh3/appforms/environments/submissions/update')),
  create: genericCommand(require('cmd/fh3/appforms/environments/submissions/create')),
  delete: genericCommand(require('cmd/fh3/appforms/environments/submissions/delete')),
  filter: genericCommand(require('cmd/fh3/appforms/environments/submissions/filter'))
};

module.exports = {
  'test appforms-submissions list': function (cb) {
    appformsenvsubmissions.list({environment: "someenv"}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'somesubmissionid');
      return cb();
    });
  },
  'test appforms-submissions filter': function (cb) {
    appformsenvsubmissions.filter({environment: "someenv", formid: "someformid", projectid: "someformproject"}, function (err, data) {
      assert.equal(err, null);
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