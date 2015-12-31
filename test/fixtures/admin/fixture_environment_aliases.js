var nock = require('nock');
var existingEnvAlias = { id : '1a', environmentId:'dev', environmentIdAlias:'myDev', environmentLabelAlias:'My Dev'};
var envReplies = {
  crud : function(){
    return existingEnvAlias;
  },
  list : function(){
    return [existingEnvAlias];
  },
  read : function(){
    return existingEnvAlias;
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function() {
  return '*';
})
.post('/api/v2/environmentaliases', '*')
.reply(200, envReplies.crud)
.get('/api/v2/environmentaliases/1a', '*')
.reply(200, envReplies.crud)
.put('/api/v2/environmentaliases/1a', '*')
.reply(200, envReplies.crud)
.delete('/api/v2/environmentaliases/1a', '*')
.reply(200, envReplies.crud)
.get('/api/v2/environmentaliases', '*')
.reply(200, envReplies.list);
