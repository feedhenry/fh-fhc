
var assert = require('assert');
var fhc = require("fhc.js");
var target = require('target.js');
var util = require('util');

module.exports = {

    'test target': function() {

      fhc.load(function (err) {
        console.log("In test target");
        
        target([], function (err, data) {
          assert.equal(err, null);
          // TODO - not working so well with mocks now that target validates the target REVISIT
          /*
          var oldTarget = data;
          target([oldTarget], function (err, data) {
            assert.equal(err, null);          
          });        
          */
        });        

      });
    }
};
