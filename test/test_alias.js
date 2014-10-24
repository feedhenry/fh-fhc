//tests for alias command
var assert = require('assert');
var fhc = require("../lib/fhc.js");
var alias = require('cmd/common/alias.js');
var conf = require("cmd/internal/fhcfg.js");
var apps = require("cmd/common/apps.js");
var request = require('../lib/utils/request.js');
var mockrequest = require("../lib/utils/mockrequest.js");
var ini = require('../lib/utils/ini.js');

//test the appid
var testAppId = "c0TPJtvFbztuS2p7NhZN3oZz", theAlias = "analias";
ini.store.persistTargets = false;
request.requestFunc = mockrequest.mockRequest;
module.exports =  {
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
  
  }
};
