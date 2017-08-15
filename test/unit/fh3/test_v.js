var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/-v.js'));

module.exports = {
  'test fhc -v': function(cb) {
    command({}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};