var assert = require('assert');
var fhc = require("fhc.js");
var keys = require("keys.js");
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
var ini = require('utils/ini.js');

module.exports = {
  'list keys' : function(){
    fhc.load(function(err){
      console.log("in test list keys");
      request.requestFunc = mockrequest.mockRequest;
      keys(['user', 'list'], function(err, list){
        assert.equal(err, null);
        assert.isNotNull(list);
        assert.equal(list.length, 1);
      });
      /*keys(['app', 'list'], function(err, list){
        assert.isNotNull(err);
      });
      ini.set("table", true);
      keys(['app', 'list', 'rDfYZYkRMYfEGaREzgm9Mu-5'], function(err, list){
        assert.equal(err, null);
        assert.isNotNull(list);
        assert.equal(list.length, 1);
      });*/
    });
  },

  'create keys' : function(){
    fhc.load(function(err){
      console.log("in test create keys");
      request.requestFunc = mockrequest.mockRequest;
      keys(['user', 'create'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['user', 'create', 'UserKey'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key);
        assert.isDefined(key.label);
        assert.isDefined(key.key);
      });
      /*keys(['app', 'create', '1239jncjjcd'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['app', 'create', 'rDfYZYkRMYfEGaREzgm9Mu-5'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['app', 'create', 'rDfYZYkRMYfEGaREzgm9Mu-5', 'AppKey'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key);
        assert.isDefined(key.label);
        assert.isDefined(key.key);
      })*/
    });
  },

  'revoke keys' : function(){
    fhc.load(function(err){
      console.log("in test revoke keys");
      request.requestFunc = mockrequest.mockRequest;
      keys.skipPrompt = true;
      keys(['user', 'revoke'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['user', 'revoke', 'pviryBwt22iZ0iInufMYBuVVadfe'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key);
        assert.isDefined(key.label);
        assert.isDefined(key.key);
      });
      /*keys(['app', 'revoke', '1239jncjjcd'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['app', 'revoke', 'rDfYZYkRMYfEGaREzgm9Mu-5'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['app', 'revoke', 'rDfYZYkRMYfEGaREzgm9Mu-5', 'pviryBwt22iZ0iInufMYBuVVadfe'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key);
        assert.isDefined(key.label);
        assert.isDefined(key.key);
      })*/
    });
  },

  'update keys' : function () {
    fhc.load(function(err){
      console.log("in test update keys");
      request.requestFunc = mockrequest.mockRequest;
      keys.skipPrompt = true;
      keys(['user', 'update'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['user', 'update', 'pviryBwt22iZ0iInufMYBuVVadfe', 'UserKey-Updated'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key);
        assert.isDefined(key.label);
        assert.equal('UserKey-Updated', key.label);
      });
      keys(['user', 'update', '1239jncjjcd'], function(err, key){
        assert.isNotNull(err);
      });
    });
  },

  'target keys' : function(){
    fhc.load(function(err){
      console.log("in test target keys");
      var key_val = "pviryBwt22iZ0iInufMYBuVVadfe";
      keys(['user', 'target', key_val], function(err, r){
        assert.equal(err, null);
        assert.equal(r, key_val);
        keys(['user', 'target'], function(err, r){
              assert.equal(err, null);
              assert.equal(r, key_val);
          });
      });
    });
  }
};