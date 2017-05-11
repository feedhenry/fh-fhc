var nock = require('nock');
var cloudReplies = {
  headers: {'Content-Type': 'application/json'},
  act: function() {
    return {ok: true, status: 'ok'};
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .post('/cloud/somefunc')
  .reply(200, cloudReplies.act, cloudReplies.headers);
