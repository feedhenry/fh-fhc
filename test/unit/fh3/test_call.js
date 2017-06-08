var assert = require('assert');
var genericCommand = require('genericCommand');
var callCmd = genericCommand(require('cmd/fh3/call'));

module.exports = {
  'test artifacts app': function(cb) {
    callCmd({url:'url',method:'POST',data:{name:'test'}}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};