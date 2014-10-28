var assert = require('assert');
var util = require('util');
var apps = require('cmd/common/apps.js');
var target = require('cmd/fhc/target.js');
var logs = require('cmd/common/logs.js');
var read = require('read.js');
var deletes = require('cmd/common/delete.js');
var create = require('cmd/common/create.js');
var fhcfg = require('cmd/fhc/fhcfg.js');
var ini = require('utils/ini.js');
var async = require('async');
var nockAppList = require('test/fixtures/app/fixture_applist')(1);
var nockAppCrd = require('test/fixtures/app/fixture_create_read_delete');

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
      assert.ok(!err, err);
      assert.ok(data.list.length > 0);
      return cb();
    });
  },
  'test read' : function(cb){
    
    read({_ : ['0123']}, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });
  },
  'test delete' : function(cb){
    deletes({_ : ['0123'] }, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data[0].status, 'ok');
      return cb();
    });            
  },
  'test delete (multiple)' : function(cb){
    deletes({_ : ['0123', '456', '789']}, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data[0].status, 'ok');
      return cb();
    });
  },
  'test create' : function(cb){
    create({ _ : ['foo1']}, function (err, data) {
      assert.equal(err, null, err);
      assert.equal(data.status, 'ok');
      return cb();
    });    
  },
   tearDown : function(cb){
     nockAppList.done();
     nockAppCrd.done();
     return cb();
   }
};
