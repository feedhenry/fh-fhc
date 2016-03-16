var assert = require('assert');
var user = require('cmd/common/user.js');
var userReadNock = require('test/fixtures/user/fixture_user_read.js');
var util = require('util');

module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test user': function(cb) {
    user({ _ : ['']}, function (err, data) {
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      assert.ok(data);
      return cb();
    });
  },
  tearDown : function(cb){
    userReadNock.done();
    return cb();
  }
};
