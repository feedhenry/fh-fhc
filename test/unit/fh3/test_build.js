var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/build'));
var nockBuild = require('test/fixtures/app/fixture_build');
var _ = require('underscore');

module.exports = {
  'test build --project --app --cloud_app --tag --environment --destination': function(cb) {
    command({project:'1a2b3c4d5e6f7g8e9f0a1b2c',app:'1a2b3c4d5e6f7g8e9f0a1b2d',cloud_app:'1a2b3c4d5e6f7g8e9f0a1b2e',tag:'1a2b3c4d5e6f7g8e9f0a1b2e', destination:'android' }, function(err,data) {
      assert.equal(err, null, err);
      assert(data.length === 1);
      data = _.first(data);
      assert(data.length === 1);
      data = _.first(data);
      assert(data.error === '');
      assert(data.status === 'complete');
      return cb();
    });
  }
};
