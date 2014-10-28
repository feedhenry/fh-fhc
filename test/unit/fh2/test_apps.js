var assert = require('assert');
var util = require('util');
var apps = require('cmd/common/apps.js');
var target = require('cmd/fhc/target.js');
var logs = require('cmd/common/logs.js');
var read = require('read.js');
var deletes = require('cmd/common/delete.js');
var create = require('cmd/common/create.js');
var fhcfg = require('cmd/fhc/fhcfg.js');
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
var ini = require('utils/ini.js');
var async = require('async');
request.requestFunc = mockrequest.mockRequest;

module.exports = {
  setUp : function(cb){
    ini.set('fhversion', 2);
    return cb();
  },
  tearDown : function(cb){
    ini.set('fhversion', 3);
    return cb();
  },
  'test apps list' : function(cb){
    apps({_ : []}, function (err, data) {
      console.log(err);
      assert.ok(!err);
      assert.ok(data.list.length === 1);
      return cb();
    });
  },
  'test read' : function(cb){
    
    read({_ : ['0123']}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  'test delete' : function(cb){
    deletes({_ : ['0123'] }, function (err, data) {
      assert.equal(err, null);
      assert.equal(data[0].status, 'ok');
      return cb();
    });            
  },
  'test delete (multiple)' : function(cb){
    deletes({_ : ['0123', '456', '789']}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data[0].status, 'ok');
      return cb();
    });
  },
  'test create' : function(cb){
    create({ _ : ['foo1']}, function (err, data) {
      assert.equal(err, null);
      assert.equal(data.status, 'ok');
      return cb();
    });    
  },
  'test logs' : function(cb){   
     logs({ _ : ['get', '01234567890123456789012340', 'dev']}, function (err, data) {
       assert.equal(err, null);
       assert.equal(data.status, 'ok');
       return cb();
     });
   }
};
