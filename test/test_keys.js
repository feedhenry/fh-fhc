var assert = require('assert');
var fhc = require("fhc.js");
var keys = require("cmd/common/user-keys.js");
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
var ini = require('utils/ini.js');
request.requestFunc = mockrequest.mockRequest;
module.exports = {
  'list keys' : function(cb){  
    keys({ _ : ['list'] }, function(err, list){
      assert.equal(err, null);
      assert.ok(list);
      assert.equal(list.list.length, 1);
      return cb();
    });
  },
  'create keys' : function(cb){  
    keys({ _ : ['add'] }, function(err, key){
      assert.ok(!err);
      keys({ _ : ['add', 'UserKey'] }, function(err, key){
        assert.equal(err, null);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.ok(key.apiKey.key);
        return cb();
      });
    });
  },
  'revoke keys' : function(cb){
    keys.skipPrompt = true;
    keys({ _ : ['delete'] }, function(err, key){
      assert.ok(err);
      keys({ _ : ['delete', 'UserKey'] }, function(err, key){
        assert.equal(err, null);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.ok(key.apiKey.key);
        return cb();
      });
    });  
  },
  'update keys' : function (cb) {
    request.requestFunc = mockrequest.mockRequest;
    keys.skipPrompt = true;
    keys({ _ : ['update'] }, function(err, key){
      assert.ok(err);
      keys({ _ : ['update', 'UserKey', 'UserKey-Updated'] }, function(err, key){
        assert.ok(!err);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.equal('UserKey-Updated', key.apiKey.label);
        keys({ _ : ['update', '1239jncjjcd'] }, function(err, key){
          assert.ok(err);
          return cb();
        });
      });
    });
  },

  'target keys' : function(cb){
    var key_val = "pviryBwt22iZ0iInufMYBuVV";
    keys({ _ : ['target', 'UserKey'] }, function(err, r){
      assert.equal(err, null);
      assert.equal(r, key_val);
      keys({ _ : ['target'] }, function(err, r){
            assert.equal(err, null);
            assert.equal(r, key_val);
            return cb();
        });
    });
  }
};
