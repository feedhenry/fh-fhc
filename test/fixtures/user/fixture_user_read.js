var nock = require('nock');

var userReadReply = function(){
  return {
    displayName: 'Foo Bar',
    domain: 'apps',
    email: 'foo@bar.com',
    status: 'ok',
    userName: 'Foo Bar',
    prefs: {},
    _etag: '"RV9Ov_q6UfyOx8kljDkQU-"'
  };
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/box/srv/1.1/ide/apps/user/read', '*')
.reply(200, userReadReply, { 'Content-Type': 'application/json' });
