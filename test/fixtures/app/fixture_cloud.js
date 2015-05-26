var nock = require('nock');
var assert = require('assert');
var cloudReplies = {
  headers : { 'Content-Type': 'application/json' },
  act : function(){
    return { ok : true, status : 'ok' };
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/cloud/somefunc')
.times(1)
.reply(200, cloudReplies.act, cloudReplies.headers)
.post('/some/custom/cloud/host')
.reply(200, cloudReplies.act, cloudReplies.headers);
