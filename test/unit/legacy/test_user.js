var assert = require('assert');
var user = require('cmd/common/user.js');
require('test/fixtures/user/fixture_user_read.js');
var util = require('util');

module.exports = {
  'test user': function(cb) {
    user({ _ : ['']}, function (err, data) {
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      assert.ok(data);
      return cb();
    });
  }
};
