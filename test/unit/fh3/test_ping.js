var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
require('test/fixtures/admin/fixture_ping');
var pingCmd = genericCommand(require('cmd/fh3/ping'));

module.exports = {
  'test artifacts app': function(cb) {
    pingCmd({app:'1a'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data, "OK");
      return cb();
    });
  }
};