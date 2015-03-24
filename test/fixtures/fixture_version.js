var nock = require('nock');
var assert = require('assert');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.get('/box/srv/1.1/tst/version', '*')
.reply(200, function(){ return '0.5.0-39'; });
