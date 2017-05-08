var assert = require('assert');
var files = require('cmd/common/files.js');
var apps = require('cmd/common/apps.js');
var filesNock = require('test/fixtures/app/fixture_files.js');
var appReadNock = require('test/fixtures/app/fixture_appread.js')(3);

module.exports = {
  'test files read' : function(cb){
    files({ _ : ['read', '0123']}, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  'test files update' : function(cb){
    files({ _ : ['update', '0123', '1234', './test/fixtures/test.js']}, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  'test files create' : function(cb){
    files({ _ : ['create', '1234', '/client/default/js/', "mockFile.js", "file" ]}, function (err, data){
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  'test files delete' : function(cb){
    files({ _ : ['delete', '1234','0123', "mockFile.js", '/client/default/js/', "file" ]}, function (err, data){
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  tearDown: function (cb){
    return cb();
  }
};
