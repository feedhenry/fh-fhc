//tests for alias command
var assert = require('assert');
var fhc = require("../lib/fhc.js");
var alias = require('../lib/alias.js');
var conf = require("../lib/fhcfg.js");
var apps = require("../lib/apps.js");
var request = require('../lib/utils/request.js');
var mockrequest = require("../lib/utils/mockrequest.js");
var ini = require('../lib/utils/ini.js');

//test the appid
var testAppId = "c0TPJtvFbztuS2p7NhZN3oZz", theAlias = "analias";
ini.configList.push({"persistTargets": false});

module.exports =  {
  "test alias" : function () {
    fhc.load(function (er){
      request.requestFunc = mockrequest.mockRequest;
      ini.del(theAlias);
      alias([theAlias+"="+testAppId],function(er,data){
        assert.equal(er,undefined);
        assert.equal(data,"ok");


      });



      //test 24 character alias arn't accepted
      alias(["Hw1ahBfiT2KEBVq9bxz4Qc8Q="+testAppId], function(err,data){

        assert.isDefined(err);
        assert.isUndefined(data);
      });


    });
  },



  "test reserved words" : function () {
    fhc.load(function (er){
      request.requestFunc = mockrequest.mockRequest;
      alias(["feedhenry="+testAppId],function (err, data) {
        assert.isDefined(err);
        assert.isUndefined(data);
      });
      var reserved = alias.reserved;
      for(var i = 0; i < reserved.length; i++){
        alias([reserved[i]+"="+testAppId],function (err, data) {
          assert.isDefined(err);
          assert.isUndefined(data);
        });
      }
    });
  },

  "test only works when logged in" : function () {
      fhc.load(function (er){
        alias([theAlias+"="+"Hw1ahBfiT2KEBVq9bxz4Qc8Q"], function (err,data){
          assert.isDefined(err);
          assert.isUndefined(data);
        });
      });
  },

  "test fh appid" : function () {
    assert.equal(fhc.appId(undefined),undefined);
    //shouldn't change valid appid
    assert.equal(fhc.appId("Hw1ahBfiT2KEBVq9bxz8Qc8H"),"Hw1ahBfiT2KEBVq9bxz8Qc8H");


  }
};