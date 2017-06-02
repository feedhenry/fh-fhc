var nock = require('nock');
var data = "OK";

module.exports = nock('https://apps.feedhenry.com')
  .get('/sys/info/ping')
  .reply(200, data);