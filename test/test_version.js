
var assert = require('assert');
var fhc = require("fhc.js");
var request = require('utils/request.js');
var version = require('cmd/common/version.js');
var mockrequest = require('utils/mockrequest.js');

module.exports = {

    'test version': function() {

      fhc.load(function (err) {
        console.log("In test version");
        request.requestFunc = mockrequest.mockRequest;
        
        // test version
        version([], function (err, data) {
          assert.equal(err, null);
          assert.notEqual(data.length, 0);
        });        

      });
    }
};
