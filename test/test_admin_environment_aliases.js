var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var existingEnvAlias = { id : '1a', environmentId:'dev', environmentIdAlias:'myDev', environmentLabelAlias:'My Dev'};
var fhReq = require('./fixtures/fhreq.js')({
  'GET /api/v2/environmentaliases' : [existingEnvAlias],
  'GET /api/v2/environmentaliases/1a' : existingEnvAlias,
  'POST /api/v2/environmentaliases' : function(doc){ return doc; },
  'PUT /api/v2/environmentaliases/1a' : function(doc){ return doc; },
  'DELETE /api/v2/environmentaliases/1a' : function(doc){ return doc; }
}), 
/*
  TODO: CLI parsing of arguments passed as --foo=bar is borked right now - fixing requires modifying how ini.js is used, 
  i.e. a big chunk of work. For now, let's just hardcoded ini calls in a mock so we can run tests
 */
ini = require('./fixtures/ini.js')({
  'id' : '1a',
  'environment' : 'dev',
  'environmentAlias' : 'myDev',
  'environmentLabelAlias': 'My Dev'
});
var restfulCmd = proxyquire('restful-cmd.js', {
  './utils/request' : fhReq,
  './utils/ini' : ini 
});
var adminenvironmentaliases = proxyquire('admin-environment-aliases.js', {
  './restful-cmd' : restfulCmd,
  './utils/ini' : ini
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
module.exports = {
    'test admin-environment-aliases list': function() {
      fhc.load(function (er){
        console.log("In test admin-environment-aliases list");
        adminenvironmentaliases([], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.length, 1);
          assert.equal(data[0].environmentId, 'dev');
          assert.equal(data[0].environmentIdAlias, 'myDev');
        });
      });
    },
    'test admin-environment-aliases read': function() {
      fhc.load(function (er){
        console.log("In test admin-environment-aliases read");
        adminenvironmentaliases(['read', '--id=1a'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.environmentId, 'dev');
        });
      });
    },
    'test admin-environment-aliases create': function() {
      fhc.load(function (er){
        console.log("In test admin-environment-aliases create");
        adminenvironmentaliases(['create', '--environment=dev', '--environmentAlias=myDev', '--environmentLabelAlias="My Dev"'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(data.environmentLabelAlias, 'My Dev');
        });
      });
    },
    'test admin-environment-aliases update': function() {
      fhc.load(function (er){
        console.log("In test admin-environment-aliases update");
        adminenvironmentaliases(['update', '--id=1a', '--environmentLabelAlias="My Dev 2"'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
    },
    'test admin-environment-aliases delete': function() {
      fhc.load(function (er){
        console.log("In test admin-environment-aliases delete");
        adminenvironmentaliases(['update', '--id=1a'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
        });
      });
    }
};
