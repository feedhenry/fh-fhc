var nock = require('nock');
var data = require('./environments');

function echoWithOk(uri, body) {
  var parsed = JSON.parse(body);
  parsed.status = 'ok';
  return parsed;
}

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/api/v2/environments', '*')
.reply(200, echoWithOk)
.get('/api/v2/environments/1a', '*')
.reply(200, data[0])
.put('/api/v2/environments/1a', '*')
.reply(200, echoWithOk)
.delete('/api/v2/environments/1a', '*')
.reply(200, data[0])
.get('/api/v2/environments/all', '*')
.reply(200, data);
