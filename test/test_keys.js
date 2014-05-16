var assert = require('assert');
var fhc = require("fhc.js");
var keys = require("user-keys.js");
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
var ini = require('utils/ini.js');

module.exports = {
  'list keys' : function(){
    fhc.load(function(err){
      request.requestFunc = mockrequest.mockRequest;
      keys(['list'], function(err, list){
        assert.equal(err, null);
        assert.isNotNull(list);
        assert.equal(list.list.length, 1);
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
      request.requestFunc = mockrequest.mockRequest;
      keys(['add'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['add', 'UserKey'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key.apiKey);
        assert.isDefined(key.apiKey.label);
        assert.isDefined(key.apiKey.key);
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
      request.requestFunc = mockrequest.mockRequest;
      keys.skipPrompt = true;
      keys(['delete'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['delete', 'UserKey'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key.apiKey);
        assert.isDefined(key.apiKey.label);
        assert.isDefined(key.apiKey.key);
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
      request.requestFunc = mockrequest.mockRequest;
      keys.skipPrompt = true;
      keys(['update'], function(err, key){
        assert.isNotNull(err);
      });
      keys(['update', 'UserKey', 'UserKey-Updated'], function(err, key){
        assert.equal(err, null);
        assert.isNotNull(key.apiKey);
        assert.isDefined(key.apiKey.label);
        assert.equal('UserKey-Updated', key.apiKey.label);
      });
      keys(['update', '1239jncjjcd'], function(err, key){
        assert.isNotNull(err);
      });
    });
  },

  'target keys' : function(){
    fhc.load(function(err){
      var key_val = "pviryBwt22iZ0iInufMYBuVV";
      keys(['target', 'UserKey'], function(err, r){
        assert.equal(err, null);
        assert.equal(r, key_val);
        keys(['target'], function(err, r){
              assert.equal(err, null);
              assert.equal(r, key_val);
          });
      });
    });
  }
};