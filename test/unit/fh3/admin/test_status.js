var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
require('test/fixtures/admin/fixture_status');
var adminstatus = genericCommand(require('cmd/fh3/admin/status'));

module.exports = {
  'test admin status': function(cb) {
    adminstatus({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status,'ok');
      return cb();
    });
  }
};
