var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/shortenurl'));

var nock = require('nock');
var data = {
  "url": "http://henr.ie/2s7DFXD",
  "longUrl": "https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com"
};

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/api/shortenurl')
  .reply(200, data);

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/api/shortenurl')
  .reply(200, data);

module.exports = {
  'test fhc shortenurl --url': function(cb) {
    command({url:'https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.url, "http://henr.ie/2s7DFXD");
      assert.equal(data.longUrl,"https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com");
      return cb();
    });
  }
};