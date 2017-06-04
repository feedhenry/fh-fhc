var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
var pingCmd = genericCommand(require('cmd/fh3/shorturl'));

var nock = require('nock');
var data = {
  "url": "http://henr.ie/2s7DFXD",
  "longUrl": "https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com"
};

module.exports = nock('https://apps.feedhenry.com')
  .get('box/api/shortenurl')
  .reply(200, data);

module.exports = {
  'test fhc shortenurl --url': function(cb) {
    pingCmd({url:'https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.url.url,"http://henr.ie/2s7DFXD");
      assert.equal(data.url.longUrl,"https://support-cuke6ultphkoxaulyhpsb6ep-dev.mbaas1.us.feedhenry.com");
      return cb();
    });
  }
};