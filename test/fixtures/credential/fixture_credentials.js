var nock = require('nock');
var data = require('./fixture_credentials.json');

module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .get('/box/api/credentials','*')
  .reply(200, data)
  .get('/box/api/credentials/1a/download', '*')
  .reply(200, data)
  .delete('/box/api/credentials/1a', '*')
  .reply(200, data)
  .persist()
  .post('/box/api/credentials','*')
  .reply(201, {});