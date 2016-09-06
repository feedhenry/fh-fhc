var nock = require('nock');
var _ = require('underscore');

var dsFixtures = require('./fixture_data_source');

var mockDs = dsFixtures.get();

var mockDSCreated = dsFixtures.apiResponse();
mockDSCreated._id = "dscreated";

var mockDSUpdatedResponse = dsFixtures.apiResponse();
mockDSUpdatedResponse.name = "Updated Name";
mockDSUpdatedResponse.endpoint = "/new/endpoint";

var requiredDSUpdate = dsFixtures.get();
requiredDSUpdate.name = "Updated Name";
requiredDSUpdate.endpoint = "/new/endpoint";

module.exports = nock('https://apps.feedhenry.com')
  .get('/api/v2/appforms/data_sources')
  .reply(200, [dsFixtures.apiResponse()])
  .get('/api/v2/appforms/data_sources/' + mockDs._id)
  .times(2)
  .reply(200, dsFixtures.apiResponse())
  .get('/api/v2/appforms/data_sources/' + "wrongdsid")
  .times(2)
  .reply(404, {
    userDetail: "Data Source Not Found"
  }, {'x-fh-request-id': "dsrequest1234"})
  .post('/api/v2/appforms/data_sources', _.omit(mockDs, "_id"))
  .reply(200, mockDSCreated)
  .put('/api/v2/appforms/data_sources/' + mockDs._id, requiredDSUpdate)
  .reply(200, mockDSUpdatedResponse)
  .delete('/api/v2/appforms/data_sources/' + mockDs._id)
  .reply(204);
