var output = require('utils/output.js');
var util = require('util');
var fhc = require('fhc.js');
var fhreq = require('utils/request.js');
var messaging = require('cmd/internal/messaging.js');
var request = require('utils/request.js');
var assert = require('assert');
var mockrequest = require('utils/mockrequest.js');
request.requestFunc = mockrequest.mockRequest;

module.exports = {
  'test messaging ping' : function(cb) {  
    // test messaging ping 
    messaging({ _ : ['ping'] }, function(err, data) {
      assert.equal(err, null);
      assert.equal(data, 'ok');
      return cb();
    });
  },
  'test messaging version' : function(cb){
    messaging({ _ : ['version'] }, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      return cb();
    });
  },
  'test messaging stats' : function(cb){
    messaging({ _ : ['stats'] }, function(err, data) {
      assert.equal(err, null);
      assert.ok(data);
      return cb();
    });
  },
  'test messaging list topics' : function(cb){
    messaging({ _ : ["topics"] }, function(err, data) {
      assert.equal(err, null);
      assert.ok(data.length>0);
      return cb();
    });
  },
  'tests messaging topics' : function(cb){
    messaging({ _ : ['topic','profile'] }, function(err, data) {
      assert.equal(err, null);
      assert.ok(data.length > 0);
      return cb();
    });  
  },
  'tests messaging topics' : function(cb){
    messaging({ _ : ['topic', 'profile', '123'] }, function(err, data) {
      assert.equal(err, null);
      assert.ok(data.length > 0);
      return cb();
    });
  }
};
