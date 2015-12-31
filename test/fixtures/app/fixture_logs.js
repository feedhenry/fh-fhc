var nock = require('nock');

var logReply = function(){
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
.post('/box/srv/1.1/ide/apps/app/logs', '*')
.reply(200, logReply, { 'Content-Type': 'application/json' });
