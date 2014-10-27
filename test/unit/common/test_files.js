
var assert = require('assert');

var util = require('util');
var request = require('utils/request.js');
var files = require('cmd/common/files.js');
var apps = require('cmd/common/apps.js');
var mockrequest = require('utils/mockrequest.js');
request.requestFunc = mockrequest.mockRequest;
module.exports = {
    'test file list': function(cb) {
      console.log("In test files");
      files({ _ : ['list', '0123']}, function (err, data) {
        assert.equal(err, null);
        assert.ok(data.children.length>0);
        return cb();
      });
    },
    'test files read' : function(cb){
      files({ _ : ['read', '0123']}, function (err, data) {
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    },
    'test files update' : function(cb){
      files({ _ : ['update', '0123', '1234', './test/fixtures/test.js']}, function (err, data) {
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    },
    'test files create' : function(cb){
      files({ _ : ['create', '1234', '/client/default/js/', "mockFile.js", "file" ]}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    },
    'test files delete' : function(cb){
      files({ _ : ['delete', '1234','0123', "mockFile.js", '/client/default/js/', "file" ]}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });  
    }
};
