
var assert = require('assert');
var fhc = require("fhc.js");
var target = require('target.js');

module.exports = {

    'test target': function() {

      fhc.load(function (err) {
        console.log("In test target");
        
        // test version
        target([], function (err, data) {
          assert.equal(err, null);
          var oldTarget = data;
          target([oldTarget], function (err, data) {
            assert.equal(err, null);          
          });        
        });        

      });
    }
};
