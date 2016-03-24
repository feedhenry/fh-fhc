var nock = require('nock');
var fs = require('fs');

var envReplies = {
  crud : function(){
    return {
      _id: "someformid",
      name: "Some Test Form"
    };
  },
  list : function(){
    return [envReplies.crud()];
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .post('/api/v2/appforms/forms', '*')
  .reply(200, envReplies.crud)
  .get('/api/v2/appforms/forms', '*')
  .reply(200, envReplies.list)
  .get('/api/v2/appforms/forms/someformid', '*')
  .reply(200, envReplies.crud)
  .put('/api/v2/appforms/forms/someformid', '*')
  .reply(200, envReplies.crud)
  .delete('/api/v2/appforms/forms/someformid', '*')
  .reply(200, envReplies.crud)
  .post('/api/v2/appforms/forms/someformid/clone', '*')
  .reply(200, envReplies.crud)
  .get('/api/v2/appforms/forms/export', '*')
  .reply(204, function(uri, requestBody) {
    return fs.createReadStream('test/fixtures/appforms/export_file.zip');
  });
