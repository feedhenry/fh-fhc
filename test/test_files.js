
var assert = require('assert');
var fhc = require("fhc.js");
var util = require('util');
var request = require('utils/request.js');
var files = require('cmd/common/files.js');
var apps = require('cmd/common/apps.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {

    'test files': function() {
      fhc.load(function (er) {
        console.log("In test files");
        request.requestFunc = mockrequest.mockRequest;
        
        // test file list
        files(['list', '0123'], function (err, data) {
          assert.equal(err, null);
          assert.notEqual(data.children.length, 0);
        });
        // test files read
        files(['read', '0123'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test files update
        files(['update', '0123', '1234', './test/fixtures/test.js'], function (err, data) {
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test files create
        files(['create', '1234', '/client/default/js/', "mockFile.js", "file" ], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
        // test files delete
        files(['delete', '1234','0123', "mockFile.js", '/client/default/js/', "file" ], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
    }
};
