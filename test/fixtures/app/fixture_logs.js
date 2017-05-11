var nock = require('nock');

var logReply = function() {
  return {
    "log": {
      "stderr": "",
      "stdout": "App started at: Tue Oct 28 2014 00:10:15 GMT+0000 (UTC) on port: 8278\n"
    },
    "status": "ok"
  };
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.get('/api/v2/mbaas/apps/dev/apps/1a2b3c4d5e6f7g8e9f0a1b2c/logs', '*')
.reply(200, logReply, { 'Content-Type': 'application/json' });
