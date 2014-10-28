var nock = require('nock');

var envReplies = {
  crud : function(url, req){
    return { 
      status : 'ok',
      _id : '1a',
      url : 'http://www.mbaas.com',
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
.post('/api/v2/mbaases', '*')
.reply(200, envReplies.crud)
.get('/api/v2/mbaases/1a2b', '*')
.reply(200, envReplies.crud)
.put('/api/v2/mbaases/1a2b', '*')
.reply(200, envReplies.crud)
.delete('/api/v2/mbaases/1a2b', '*')
.reply(200, envReplies.crud)
.get('/api/v2/mbaases', '*')
.reply(200, envReplies.list);
