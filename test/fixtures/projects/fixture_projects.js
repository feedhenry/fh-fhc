var nock = require('nock');

var projectFixtures = require('./fixture_project');
var mockProject = projectFixtures.get();

var listResponses = require('./list_responses');

module.exports = nock('https://apps.feedhenry.com')
  .put('/box/api/projects/2a')
  .reply(200, mockProject)
  .get('/box/api/projects/2a')
  .reply(200, mockProject)
  .get('/box/api/projects/1a')
  .reply(200, mockProject)
  .get('/box/api/projects/' + mockProject.guid)
  .reply(200, mockProject)
  .delete('/box/api/projects/' + mockProject.guid)
  .reply(200, mockProject)
  .get('/box/api/projects?apps=true')
  .reply(200, listResponses.apps())
  .get('/box/api/projects?apps=false')
  .reply(200, listResponses.noapps());

