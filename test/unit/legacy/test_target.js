var assert = require('assert');
var target = require('cmd/fhc/target.js');

module.exports = {
  'test target': function(cb) {
    target({_ : []}, function (err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
