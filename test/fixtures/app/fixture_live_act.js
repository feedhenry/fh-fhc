var nock = require('nock');
module.exports = nock('https://apps-live.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/cloud/somefunc')
.reply(200, function(){
  return { ok : true, status : 'ok', live : true};
}, { 'Content-Type': 'application/json' });
