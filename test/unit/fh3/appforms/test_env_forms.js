var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_env_forms');
var appformsenvforms = {
  list : genericCommand(require('cmd/fh3/appforms/environments/forms/list')),
  read : genericCommand(require('cmd/fh3/appforms/environments/forms/read')),
  copytocore : genericCommand(require('cmd/fh3/appforms/environments/forms/copytocore')),
  deploy : genericCommand(require('cmd/fh3/appforms/environments/forms/deploy')),
  lifecycle : genericCommand(require('cmd/fh3/appforms/environments/forms/lifecycle')),
  promote : genericCommand(require('cmd/fh3/appforms/environments/forms/promote')),
  undeploy : genericCommand(require('cmd/fh3/appforms/environments/forms/undeploy')),
  update : genericCommand(require('cmd/fh3/appforms/environments/forms/update'))
};


module.exports = {
  'test appforms-forms list': function(cb) {
    appformsenvforms.list({environment: "someenv"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.length, 1);
      assert.equal(data[0]._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms read': function(cb) {
    appformsenvforms.read({ environment: "someenv", id : 'someformid'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms update': function(cb) {
    appformsenvforms.update({ environment: "someenv", id: 'someformid', formfile : "test/fixtures/appforms/fixture_form.json" }, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms deploy': function(cb) {
    appformsenvforms.deploy({ id: 'someformid', environment: "someenv" }, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms deploy wrong environment': function(cb) {
    appformsenvforms.deploy({ id: 'someformid', environment: "wrongenvid" }, function(err) {
      assert.notEqual(err, null, "Expected an error");
      //An error should produce a request ID (see fixture_env_forms.js)
      assert.equal('requestid12345', err.requestId);
      assert(err.toString().indexOf('Environment with ID wrongenvid not found') > -1, "Expected an environment error message");
      return cb();
    });
  },
  'test appforms-forms undeploy': function(cb) {
    appformsenvforms.undeploy({ environment: "someenv", id : 'someformid' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test appforms-forms lifecycle': function(cb) {
    appformsenvforms.lifecycle({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data[0].deployments[0].dev._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms copytocore': function(cb) {
    appformsenvforms.copytocore({environment: "someenv", id: "someformid"}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._id, 'someformid');
      return cb();
    });
  },
  'test appforms-forms promote': function(cb) {
    appformsenvforms.promote({from: "someenvfrom", to: "someenvto", id: "someformid"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};