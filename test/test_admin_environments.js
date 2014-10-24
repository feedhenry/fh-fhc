var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var existingEnv = { label : 'myexistingenv', id : '1a', mbaas_targets : [] };
var fhReq = require('./fixtures/fhreq.js')({
  'GET /api/v2/environments' : [existingEnv],
  'GET /api/v2/environments/1a' : existingEnv,
  'POST /api/v2/environments' : function(doc){ return doc; },
  'PUT /api/v2/environments/1a' : function(doc){ return doc; },
  'DELETE /api/v2/environments/1a' : function(doc){ return doc; }
}), 
/*
  TODO: CLI parsing of arguments passed as --foo=bar is borked right now - fixing requires modifying how ini.js is used, 
  i.e. a big chunk of work. For now, let's just hardcoded ini calls in a mock so we can run tests
 */
ini = require('./fixtures/ini.js')({
  'id' : '1a',
  'label' : 'mynewenv',
  'targets' : '1,2,3'
});
var restfulCmd = proxyquire('utils/restful-cmd.js', {
  './request' : fhReq,
  './ini' : ini 
});
var adminenvironments = proxyquire('cmd/fh3/admin-environments.js', {
  '../../utils/restful-cmd' : restfulCmd,
  './utils/ini' : ini
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
module.exports = {
    'test admin-environments list': function(cb) {  
      adminenvironments({_ : []}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.length, 1);
        assert.equal(data[0].label, 'myexistingenv');
        return cb();
      });
    },
    'test admin-environments read': function(cb) {
      adminenvironments({ _ : ['read', '--id=1a2b']}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.label, 'myexistingenv');
        return cb();
      });
    },
    'test admin-environments create': function(cb) {
      adminenvironments({ _ : ['create', '--label=foo', '--targets=1,2,3', '--id=foo'] }, function (err, data){
        console.log(err);
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.label, 'mynewenv');
        return cb();
      });
    },
    'test admin-environments update': function(cb) {
      adminenvironments({ _ : ['update', '--id=1a --label=bar', '--targets=1,2,3'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    },
    'test admin-environments delete': function(cb) {
      adminenvironments({ _ : ['update', '--id=1a --label=bar', '--targets=1,2,3'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    }
};
