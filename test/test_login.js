var assert = require('assert');
var fhc = require("fhc.js");
var util = require('util');
var request = require('utils/request.js');
var login = require('login.js');
var mockrequest = require('utils/mockrequest.js');


module.exports = {

    'test login' : function() {
      // console.log("In test login");
      //TODO - Temp commenting - needs a proper look 
      //AM - Seems like the mock data is being passed into fhlogin.js
       
    /*  fhc.load(function(er) {
        request.requestFunc = mockRequest;
        
        // test login 
        login(['testuser', 'testpassword'], function(data, err) {
          assert.equal(err, null);
          assert.equal(data, "login ok");

        });      
      });*/
      
    }
};