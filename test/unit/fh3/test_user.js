var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_user');
var userCmd = genericCommand(require('cmd/fh3/user'));

module.exports = {
  'test fhc user': function(cb) {
    userCmd({domain:'testing'}, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data.userName, "Example User");
      return cb();
    });
  }
};