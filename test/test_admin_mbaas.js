var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var existingMbaas = { url : 'http://mbaas.com', id : '1a', servicekey : [] };
var fhReq = require('./fixtures/fhreq.js')({
  'GET /api/v2/mbaases' : [existingMbaas],
  'GET /api/v2/mbaases/1a' : existingMbaas,
  'POST /api/v2/mbaases' : function(doc){ return doc; },
  'PUT /api/v2/mbaases/1a' : function(doc){ return doc; },
  'DELETE /api/v2/mbaases/1a' : function(doc){ return doc; }
}), 
/*
  TODO: CLI parsing of arguments passed as --foo=bar is borked right now - fixing requires modifying how ini.js is used, 
  i.e. a big chunk of work. For now, let's just hardcoded ini calls in a mock so we can run tests
 */
ini = require('./fixtures/ini.js')({
  'id' : '1a',
  'url' : 'http://mbaas.com',
  'servicekey' : '1a2b',
  'username':'test',
  'password':'test'

});
var restfulCmd = proxyquire('utils/restful-cmd.js', {
  './request' : fhReq,
  './ini' : ini 
});
var adminmbaas = proxyquire('cmd/fh3/admin-mbaas.js', {
  '../../utils/restful-cmd' : restfulCmd,
  './utils/ini' : ini
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');
module.exports = {
    'test admin-mbaas list': function(cb) {
      adminmbaas({_ : [] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.length, 1);
        assert.equal(data[0].url, 'http://mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas read': function(cb) {
      adminmbaas({_ : ['read', '--id=1a2b'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.url, 'http://mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas create': function(cb) {
      adminmbaas({_ : ['create', '--url=http://mbaas.com', '--servicekey=1a2b', '--id=foo', '--username=test', '--password=test'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.url, 'http://mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas update': function(cb) {
      adminmbaas({_ : ['update', '--id=1a', '--url=http://mbaas2.com', '--key=1a2b'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    },
    'test admin-mbaas delete': function(cb) {
      adminmbaas({_ : ['update', '--id=1a', '--url=http://mbaas2.com', '--key=1a2b'] }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        return cb();
      });
    }
};
