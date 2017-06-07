var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
var vCmd = genericCommand(require('cmd/fh3/-v.js'));

module.exports = {
  'test fhc -v': function(cb) {
    vCmd.customCmd({}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};