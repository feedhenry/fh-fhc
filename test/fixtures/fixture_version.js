var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.get('/sys/info/version', '*')
.reply(200, function(){ return '0.5.0-39'; });
