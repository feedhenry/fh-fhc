
var assert = require('assert');
var fhc = require("fhc.js");
var request = require('utils/request.js');
var user = require('cmd/common/user.js');
var mockrequest = require('utils/mockrequest.js');
var util = require('util');

module.exports = {
  'test user': function() {
    fhc.load(function (er) {
      console.log("In test user");
      request.requestFunc = mockrequest.mockRequest;
       
      user([''], function (err, data) {
        assert.equal(err, null, "Err not null: " + util.inspect(err));
      });
    });
  }
};
