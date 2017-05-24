var nock = require('nock');
var data = require('./teams.json');

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
  .get('/api/v2/admin/teams', '*')
  .reply(200, data)
  .get('/api/v2/admin/teams/1a', '*')
  .reply(200, data[0])
  .post('/api/v2/admin/teams', '*')
  .reply(200)
  .delete('/api/v2/admin/teams/1a', '*')
  .reply(200)
  .post('/api/v2/admin/teams/1a/user/2b')
  .reply(200)
  .delete('/api/v2/admin/teams/1a/user/2b')
  .reply(200)
  .get('/api/v2/admin/users/1a2b/teams')
  .reply(200, data[0]);

