var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/ping'));

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .get('/api/v2/mbaas/apps/dev/apps/1a/host')
  .reply(200, {
    "url": "https://support-k2nqj5yve7jrudhuprei2xzf-dev.mbaas1.us.feedhenry.com"
  })
  .get('/sys/info/ping')
  .reply(200, {});

module.exports = {
  'test ping app': function(cb) {
    command({app:'1a', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};