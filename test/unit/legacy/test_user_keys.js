var assert = require('assert');
var keys = require("cmd/common/keys/user.js");
var userKeysNock = require('test/fixtures/user/fixture_user_keys');

module.exports = {
  setUp : function(cb){
    return cb();
  },
  'list keys' : function(cb){  
    keys({ _ : ['list'] }, function(err, list){
      assert.equal(err, null, err);
      assert.ok(list);
      assert.equal(list.list.length, 1);
      return cb();
    });
  },
  'create keys' : function(cb){  
    keys({ _ : ['add'] }, function(err){
      assert.ok(!err, err);
      keys({ _ : ['add', 'UserKey'] }, function(err, key){
        assert.equal(err, null, err);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.ok(key.apiKey.key);
        return cb();
      });
    });
  },
  'revoke keys' : function(cb){
    keys.skipPrompt = true;
    keys({ _ : ['delete'] }, function(err){
      assert.ok(err);
      keys({ _ : ['delete', 'UserKey'] }, function(err, key){
        assert.equal(err, null, err);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.ok(key.apiKey.key);
        return cb();
      });
    });  
  },
  'update keys' : function (cb) {
    keys.skipPrompt = true;
    keys({ _ : ['update'] }, function(err){
      assert.ok(err);
      keys({ _ : ['update', 'UserKey', 'UserKey-Updated'] }, function(err, key){
        assert.ok(!err, err);
        assert.ok(key.apiKey);
        assert.ok(key.apiKey.label);
        assert.equal('UserKey-Updated', key.apiKey.label);
        keys({ _ : ['update', '1239jncjjcd'] }, function(err){
          assert.ok(err);
          return cb();
        });
      });
    });
  },

  'target keys' : function(cb){
    var key_val = "pviryBwt22iZ0iInufMYBuVV";
    keys({ _ : ['target', 'UserKey'] }, function(err, r){
      assert.equal(err, null, err);
      assert.equal(r, key_val);
      keys({ _ : ['target'] }, function(err, r){
            assert.equal(err, null);
            assert.equal(r, key_val);
            return cb();
        });
    });
  },
  tearDown : function(cb){
    userKeysNock.done();
    return cb();
  }
};
