var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var actRequestMocks = require('test/fixtures/act.js');
var act = require('cmd/fh2/app/act.js');
var cloudFixture = require('test/fixtures/app/fixture_cloud');
var appReadFixture = require('test/fixtures/app/fixture_appread')(2);
var liveActFixture = require('test/fixtures/app/fixture_live_act');
var appHostsFixture = require('test/fixtures/app/fixture_hosts')(2);

module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test act functions': function(cb) {  
    var argv = { 
      _ : ['0123', 'somefunc','{\"name\":\"bono\"}', '--env=dev']
    };
    act(argv, function (err, data){
      assert.ok(!err, err);
      assert.equal(data.status, 'ok');
      assert.equal(typeof data.live, 'undefined');
      argv._[3] = '--env=live';
      act(argv, function (err, data){
        assert.equal(err, null, err);
        assert.equal(data.status, 'ok');
        assert.equal(data.live, true);
        cb();
      });
    });
  },
  tearDown : function(cb){
    appReadFixture.done();
    appHostsFixture.done();
    liveActFixture.done();
    cloudFixture.done();
    // TODO close out cloudFixture
    return cb();
  }
};
