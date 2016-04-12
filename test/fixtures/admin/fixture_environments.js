var nock = require('nock');
var data = require('./environments');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/api/v2/environments', '*')
.reply(200, data[0])
.get('/api/v2/environments/1a', '*')
.reply(200, data[0])
.put('/api/v2/environments/1a', '*')
.reply(200, data[0])
.delete('/api/v2/environments/1a', '*')
.reply(200, data[0])
.get('/api/v2/environments/all', '*')
.reply(200, data);
