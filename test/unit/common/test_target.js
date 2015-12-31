var assert = require('assert');
var target = require('cmd/fhc/target.js');

module.exports = {
  'test target': function(cb) {
    target({_ : []}, function (err) {
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
