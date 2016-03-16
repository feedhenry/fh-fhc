var nock = require('nock');

var envReplies = {
  crud : function(){
    return {
      _id: "someformid",
      name: "Some Test Form"
    };
  },
  list : function(){
    return [envReplies.crud()];
  },
  lifecycle: function(){
    return [ {
      _id: "someformid",
      name: "Some Form",
      deployments: [{
        dev: {
          _id: "someformid",
          appsUsingForm: 3,
          createdBy: "testing-admin@example.com",
          description: "Blank form with no fields",
          lastDataRefresh: "2015-05-18T10:08:46.451Z",
          lastUpdated: "Mon, 18 May 2015 10:08:46 GMT",
          lastUpdatedTimestamp: 1431943726464,
          name: "Some Form",
          submissionsToday: 11,
          submissionsTotal: 312,
          updatedBy: "someuser@example.com"
        }
      }]
    }
    ]
  }
};

module.exports = nock('https://apps.feedhenry.com')
  .filteringRequestBody(function() {
    return '*';
  })
  .get('/api/v2/mbaas/someenv/appforms/forms', '*')
  .reply(200, envReplies.list)
  .get('/api/v2/mbaas/someenv/appforms/forms/someformid', '*')
  .reply(200, envReplies.crud)
  .post('/api/v2/mbaas/someenv/appforms/forms/someformid/deploy', '*')
  .reply(200, envReplies.crud)
  .put('/api/v2/mbaas/someenv/appforms/forms/someformid/deploy', '*')
  .reply(200, envReplies.crud)
  .post('/api/v2/mbaas/someenv/appforms/forms/someformid/copy_to_core', '*')
  .reply(200, envReplies.crud)
  .post('/api/v2/mbaas/someenvfrom/appforms/forms/someformid/promote/someenvto', '*')
  .reply(200, envReplies.crud)
  .delete('/api/v2/mbaas/someenv/appforms/forms/someformid', '*')
  .reply(200, envReplies.crud)
  .get('/api/v2/mbaas/appforms/lifecycle', '*')
  .reply(200, envReplies.lifecycle);
