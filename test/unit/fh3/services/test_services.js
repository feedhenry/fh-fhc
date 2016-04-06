var assert = require('assert');
require('test/fixtures/fixture_services');
var servicesCmd = require('cmd/fh3/services');
var serviceFixtures = require('test/fixtures/fixture_service');
var dataSourceFixtures = require('test/fixtures/appforms/fixture_data_source');

var mockService = serviceFixtures.get();
var mockDataSource = dataSourceFixtures.get();


module.exports = {
  "It Should List Data Sources For A Service": function(done){
    servicesCmd({_: ['data-sources', mockService.guid]}, function(err, serviceDataSources){
      assert.ok(!err, "Expected No Error");
      //Should be an array of data sources.
      assert.equal(mockDataSource._id, serviceDataSources[0]._id);

      done();
    });
  }
};
