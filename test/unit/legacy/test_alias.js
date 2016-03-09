//tests for alias command
var assert = require('assert');
var fhc = require("lib/fhc.js");
var alias = require('cmd/fh2/alias.js');
var appListNock = require('test/fixtures/app/fixture_applist.js')(4);
var ini = require('lib/utils/ini.js');
// Prevent saving config to disk
ini.save = function(cb){
  return cb(null, true);
};

//test the appid
var testAppId = "pviryBwt22iZ0iInufMYBuVV", theAlias = "analias";

module.exports =  {
  setUp : function(cb){
    return cb();
  },
  "test alias" : function (cb) {
    ini.del(theAlias);
    var argv = { _ : [theAlias+"="+testAppId] };
    alias(argv,function(err,data){
      assert.ok(!err, err);
      assert.equal(data,"ok");
      //test 24 character alias arn't accepted
      argv = { _ : ["Hw1ahBfiT2KEBVq9bxz4Qc8Q="+testAppId] };
      alias(argv, function(err,data){
        assert.ok(err);
        assert.ok(!data);
        return cb();
      });
    });
  },
  "test reserved words" : function (cb) {
    var argv = { _ : ["feedhenry="+testAppId] };
    alias(argv,function (err, data) {
      assert.ok(err);
      assert.ok(!data);
      return cb();
    });
  },
  "test only works when logged in" : function (cb) {
    var argv = { _ : [theAlias+"="+"Hw1ahBfiT2KEBVq9bxz4Qc8Q"]};
    alias(argv, function (err,data){
      assert.ok(err);
      assert.ok(!data);
      return cb();
    });
  },
  "test fh appid" : function (cb) {
    assert.equal(fhc.appId(undefined),undefined);
    //shouldn't change valid appid
    assert.equal(fhc.appId("Hw1ahBfiT2KEBVq9bxz8Qc8H"),"Hw1ahBfiT2KEBVq9bxz8Qc8H");
    return cb();
  },
  "tearDown" : function(cb){
    appListNock.done();
    return cb();
  }
};
