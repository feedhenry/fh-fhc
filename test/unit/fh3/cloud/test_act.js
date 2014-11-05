var assert = require('assert');
var genericCommand = require('genericCommand');
var nockCloud = require('test/fixtures/app/fixture_cloud');
var nockHosts = require('test/fixtures/app/fixture_hosts')(1);
var act = genericCommand(require('cmd/fh3/app/act'));
var appReadNock = require('test/fixtures/app/fixture_appread.js')(1);
module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test fh3 act': function(cb) {
    act({app : '1a', fn : 'somefunc', 'data' : '', 'env' : 'development'}, function (err, data){
      assert.equal(err, null, err);
      assert(data.ok === true);
      return cb();
    });
  }, 
  tearDown : function(cb){
    appReadNock.done();
    nockHosts.done();
    nockCloud.done();
    return cb();
  }
};
