var nock = require('nock');

var envReplies = {
  crud : function(url, req){
    return { 
      status : 'ok',
      _id : '1a',
      label : 'My env',
      targets : ['http://www.1.com', 'http://www.2.com']
    };
  },
  list : function(){
    return [envReplies.crud()];
  }
};

module.exports = nock('https://apps.feedhenry.com')
.filteringRequestBody(function(path) {
  return '*';
})
.post('/api/v2/environments', '*')
.reply(200, envReplies.crud)
.get('/api/v2/environments/1a', '*')
.reply(200, envReplies.crud)
.put('/api/v2/environments/1a', '*')
.reply(200, envReplies.crud)
.delete('/api/v2/environments/1a', '*')
.reply(200, envReplies.crud)
.get('/api/v2/environments', '*')
.reply(200, envReplies.list);
