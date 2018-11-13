var assert = require('assert');
var genericCommand = require('genericCommand');
var urlPreviewCmd = genericCommand(require('cmd/fh3/preview/url'));

var nock = require('nock');
var data = {
  "url": "https://support.us.feedhenry.com/box/srv/1.1/wid/support/studio/1a/container"
};

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/wid/apps/studio/1a/container')
  .reply(200, data);

module.exports = {
  'test fhc preview url --app': function(cb) {
    urlPreviewCmd({app:'1a', json:true}, function(err, data) {
      assert.equal(err, null, "No Error is Expected");
      assert.notEqual(data, null, "Data is Expected");
      assert.equal(data.url, "https://apps.feedhenry.com/box/srv/1.1/wid/apps/studio/1a/container");
      return cb();
    });
  }
};