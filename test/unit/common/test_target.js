
var assert = require('assert');
var fhc = require("fhc.js");
var target = require('cmd/common/target.js');
var util = require('util');

module.exports = {
  'test target': function(cb) {
    target({_ : []}, function (err, data) {
      assert.equal(err, null);
      return cb();
      
      // TODO - not working so well with mocks now that target validates the target REVISIT
      // var oldTarget = data;
      // target({_ : [oldTarget]}, function (err, data) {
      //   assert.equal(err, null);
      //   console.log(data);
      //   return cb();
      // });        
      
    });        
  }
};
