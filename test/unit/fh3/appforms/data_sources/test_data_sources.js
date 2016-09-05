var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_data_sources');
var dataSourceFixtures = require('test/fixtures/appforms/fixture_data_source');

var appformsDataSources = {
  list : genericCommand(require('cmd/fh3/appforms/data-sources/list')),
  read : genericCommand(require('cmd/fh3/appforms/data-sources/read')),
  create: genericCommand(require('cmd/fh3/appforms/data-sources/create')),
  update: genericCommand(require('cmd/fh3/appforms/data-sources/update')),
  remove: genericCommand(require('cmd/fh3/appforms/data-sources/remove'))
};


var mockDs = dataSourceFixtures.get();

module.exports = {
  "test list data sources": function(done){
    appformsDataSources.list({}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(data._table, "Expected A Table For Listing Data Sources");
      assert.equal(data[0]._id, mockDs._id);
      assert.ok(!data[0].data, "Expected No Data Response");

      done();
    });
  },
  "test read data source": function(done){
    appformsDataSources.read({id: mockDs._id}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);

      done();
    });
  },
  "test read data source not found": function(done){
    appformsDataSources.read({id: "wrongdsid"}, function(err, data){
      assert.ok(err.toString().indexOf("Found") > -1, "Expected Not Found Error Message");
      //An error response should have a request ID (See test/fixtures/appforms/fixture_data_sources)
      assert.equal('dsrequest1234', err.requestId);
      assert.ok(!data, "Expected No Data");
      done();
    });
  },
  "test create data source": function(done){
    appformsDataSources.create({name: mockDs.name, serviceGuid: mockDs.serviceGuid, endpoint: mockDs.endpoint, refreshInterval: mockDs.refreshInterval, description: mockDs.description, numAuditLogEntries: 100}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, "dscreated");

      done();
    });
  },
  "test create data source missing data": function(done){
    appformsDataSources.create({name: mockDs.name, endpoint: mockDs.endpoint, refreshInterval: mockDs.refreshInterval, description: mockDs.description}, function(err, data){
      assert.ok(err, "Expected An Error ");
      assert.ok(!data, "Expected No Data");

      done();
    });
  },
  "test update data source": function(done){
    appformsDataSources.update({id: mockDs._id, name: "Updated Name", endpoint: "/new/endpoint"}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.equal(data.name, "Updated Name");
      assert.equal(data.endpoint, "/new/endpoint");
      assert.equal(data.serviceGuid, mockDs.serviceGuid);

      done();
    });
  },
  "test update data source not found": function(done){
    appformsDataSources.update({id: "wrongdsid", name: "Updated Name", endpoint: "/new/endpoint"}, function(err, data){
      assert.ok(err, "Expected An Error ");
      assert.equal(data, undefined);

      done();
    });
  },
  "test remove data source": function(done){
    appformsDataSources.remove({id: mockDs._id}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(!data, "Expected No Data In Response");

      done();
    });
  }
};