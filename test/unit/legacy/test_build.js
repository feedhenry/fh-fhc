var assert = require('assert');
var nockBuild = require('test/fixtures/app/fixture_build');
var build = require('cmd/common/build');
var _ = require('underscore');
module.exports = {
  'test common build': function(cb) {
    build({_ : ['project=1a2b3c4d5e6f7g8e9f0a1b2c', 'app=1a2b3c4d5e6f7g8e9f0a1b2d', 'cloud_app=1a2b3c4d5e6f7g8e9f0a1b2e', 'tag=0.2.0', 'destination=android']}, function (err, data){
      assert.equal(err, null, err);
      assert.ok(data.length === 1);
      data = _.first(data);
      assert.ok(data.length === 1);
      data = _.first(data);
      assert.ok(data.error === '');
      assert.ok(data.status === 'complete');
      nockBuild.done();
      return cb();
    });
  }
};
