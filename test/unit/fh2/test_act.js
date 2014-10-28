var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var actRequestMocks = require('test/fixtures/act.js');
var act = proxyquire('cmd/fh2/act.js', {
  'request' : actRequestMocks
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {
  'test act functions': function(cb) {  
    request.requestFunc = mockrequest.mockRequest;
    var argv = { 
      _ : ['0123', 'getCloudData','{\"name\":\"bono\"}', '--env=dev']
    };
    act(argv, function (err, data){
      assert.ok(!err);
      assert.equal(data.status, 'ok');
      assert.equal(typeof data.live, 'undefined');
      argv._[3] = '--env=live';
      act(argv, function (err, data){
        assert.equal(err, null);
        assert.equal(data.status, 'ok');
        assert.equal(data.live, true);
        cb();
      });
    });
  }
};