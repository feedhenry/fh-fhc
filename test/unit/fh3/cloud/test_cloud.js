var assert = require('assert');
var genericCommand = require('genericCommand');
var nockCloud2 = require('test/fixtures/app/fixture_cloud2');
var nockHosts = require('test/fixtures/app/fixture_hosts')(2);
var appReadNock = require('test/fixtures/app/fixture_appread.js')(4);
var cloud = genericCommand(require('cmd/fh3/app/cloud'));
module.exports = {
  'test fh3 cloud': function(cb) {
    cloud({app : '1a', path : '/some/custom/cloud/host', 'data' : '', 'env' : 'development'}, function(err, data) {
      assert.equal(err, null, err);
      assert(data.ok === true);
      return cb();
    });
  }
};