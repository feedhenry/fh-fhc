var assert = require('assert');
var fhc = require("fhc.js");
var util = require('util');
var request = require('utils/request.js');
var login = require('cmd/common/login.js');
var mockrequest = require('utils/mockrequest.js');


module.exports = {

    'test login' : function() {
      /* TODO
      console.log("In test login");
       
      fhc.load(function(err) {
        request.requestFunc = mockrequest.mockRequest;
        
        // test login 
        login(['testuser', 'testpassword'], function(data, err) {
          assert.equal(err, null);
          assert.equal(data, "login ok");

        });      
      });
      */
    }
};
