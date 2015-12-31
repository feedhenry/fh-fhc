var assert = require('assert');
var apps = require('cmd/common/apps.js');
var read = require('cmd/fh2/app/read.js');
var deletes = require('cmd/fh2/app/delete.js');
var create = require('cmd/fh2/app/create.js');
var ini = require('utils/ini.js');
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
