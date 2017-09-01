var nock = require('nock');
var _ = require('underscore');

var dsFixtures = require('./fixture_data_source');

var mockDs = dsFixtures.get();

module.exports = nock('https://apps.feedhenry.com')
  .get('/api/v2/mbaas/someenv/appforms/data_sources')
  .reply(200, [dsFixtures.withData()])
  .get('/api/v2/mbaas/someenv/appforms/data_sources/' + mockDs._id)
  .reply(200, dsFixtures.withData())
  .get('/api/v2/mbaas/someenv/appforms/data_sources/' + "wrongdsid")
  .reply(404, {
    userDetail: "Data Source Not Found"
  })
  .post('/api/v2/mbaas/someenv/appforms/data_sources/validate')
  .times(2)
  .reply(200, dsFixtures.withValidationResultValid())
  .post('/api/v2/mbaas/someenv/appforms/data_sources/' + mockDs._id + '/refresh')
  .reply(200, dsFixtures.withData())
  .get('/api/v2/mbaas/someenv/appforms/data_sources/' + mockDs._id + "/audit_logs")
  .reply(200, dsFixtures.withData());
