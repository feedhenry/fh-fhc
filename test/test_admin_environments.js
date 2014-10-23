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
  './utils/restful-cmd' : restfulCmd,
  './utils/ini' : ini
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
module.exports = {
    'test admin-environments list': function() {
      fhc.load(function (er){
        console.log("In test admin-environments list");
        adminenvironments([], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.length, 1);
          assert.equal(data[0].label, 'myexistingenv');
        });
      });
    },
    'test admin-environments read': function() {
      fhc.load(function (er){
        console.log("In test admin-environments read");
        adminenvironments(['read', '--id=1a2b'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.label, 'myexistingenv');
        });
      });
    },
    'test admin-environments create': function() {
      fhc.load(function (er){
        console.log("In test admin-environments create");
        adminenvironments(['create', '--label=foo', '--targets=1,2,3', '--id=foo'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.label, 'mynewenv');
        });
      });
    },
    'test admin-environments update': function() {
      fhc.load(function (er){
        console.log("In test admin-environments update");
        adminenvironments(['update', '--id=1a --label=bar', '--targets=1,2,3'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
    },
    'test admin-environments delete': function() {
      fhc.load(function (er){
        console.log("In test admin-environments delete");
        adminenvironments(['update', '--id=1a --label=bar', '--targets=1,2,3'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
    }
};
