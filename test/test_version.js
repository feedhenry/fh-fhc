var assert = require('assert');
var fhc = require("fhc.js");
var request = require('utils/request.js');
var version = require('cmd/common/version.js');
var mockrequest = require('utils/mockrequest.js');
module.exports = {
  'test version': function(cb) {
    request.requestFunc = mockrequest.mockRequest;
    // test version
    version({ _ : []}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data);
      return cb();
    });        
  }
};
