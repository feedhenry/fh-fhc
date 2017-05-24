var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.get('/box/api/status', '*')
.reply(200, {
  "status": "ok",
  "summary": {
    "amqp": "ok",
    "db": "ok",
    "cache": "ok",
    "git": "ok"
  }
})