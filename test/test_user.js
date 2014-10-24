
var assert = require('assert');
var fhc = require("fhc.js");
var request = require('utils/request.js');
var user = require('cmd/common/user.js');
var mockrequest = require('utils/mockrequest.js');
var util = require('util');
request.requestFunc = mockrequest.mockRequest;

module.exports = {
  'test user': function(cb) {  
    user({ _ : ['']}, function (err, data) {
      assert.equal(err, null, "Err not null: " + util.inspect(err));
      assert.ok(data);
      return cb();
    });
  }
};
