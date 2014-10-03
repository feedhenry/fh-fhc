var assert = require('assert');
var fhc = require("fhc.js");
var proxyquire = require("proxyquire");
var actRequestMocks = require('./fixtures/act.js');
var act = proxyquire('act.js', {
  'request' : actRequestMocks
});
var request = require('utils/request.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {

    'test act functions': function() {
      fhc.load(function (er){
        console.log("In test act");
        request.requestFunc = mockrequest.mockRequest;

        act(['0123', 'getCloudData','{\"name\":\"bono\"}'], function (err, data){
          assert.equal(err, null);
          assert.equal(data.status, 'ok');
          assert.equal(typeof data.live, 'undefined');

          act(['0123', 'getCloudData','{\"name\":\"bono\"}', '--env=live'], function (err, data){
            assert.equal(err, null);
            assert.equal(data.status, 'ok');
            assert.equal(data.live, true);
          });

        });
      });
    }
};
