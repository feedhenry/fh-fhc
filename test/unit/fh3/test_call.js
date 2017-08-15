var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/call'));

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/call')
  .reply(200, {})
  .post('/url')
  .reply(200, {});

module.exports = {
  'test artifacts app': function(cb) {
    command({url:'url',method:'POST',data:{name:'test'}}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};