var nock = require('nock');
var cloudReplies = {
  headers: {'Content-Type': 'application/json'},
  response: function (){
    return {ok: true, status: 'ok'};
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/api/migrate/1a')
  .reply(200, cloudReplies.response, cloudReplies.headers);
