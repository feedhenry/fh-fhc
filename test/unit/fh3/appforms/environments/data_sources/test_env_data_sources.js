var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/appforms/fixture_env_data_sources');
var dataSourceFixtures = require('test/fixtures/appforms/fixture_data_source');

var mockDs = dataSourceFixtures.get();

var mockEnvId = "someenv";


var appformsEnvDataSources = {
  list : genericCommand(require('cmd/fh3/appforms/environments/data-sources/list')),
  read : genericCommand(require('cmd/fh3/appforms/environments/data-sources/read')),
  validate: genericCommand(require('cmd/fh3/appforms/environments/data-sources/validate')),
  refresh: genericCommand(require('cmd/fh3/appforms/environments/data-sources/refresh')),
  auditLogs: genericCommand(require('cmd/fh3/appforms/environments/data-sources/audit-logs'))
};


module.exports = {
  "test list environment data sources": function(done){
    appformsEnvDataSources.list({environment: mockEnvId}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.ok(data._table, "Expected A Table For Listing Data Sources");
      assert.equal(data[0]._id, mockDs._id);
      assert.ok(data[0].data, "Expected A Data Response");

      done();
    });
  },
  "test read environment data source": function(done){
    appformsEnvDataSources.read({environment: mockEnvId, id: mockDs._id}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.ok(data.data, "Expected A Data Response");

      done();
    });
  },
  "test read environment data source not found": function(done){
    appformsEnvDataSources.read({environment: mockEnvId, id: "wrongdsid"}, function(err, data){
      assert.ok(err.indexOf("Found") > -1, "Expected Not Found Error Message");
      assert.ok(!data, "Expected No Data");

      done();
    });
  },
  "test validate environment data source": function(done){
    appformsEnvDataSources.validate({environment: mockEnvId, name: mockDs.name, serviceGuid: mockDs.serviceGuid, endpoint: mockDs.endpoint, description: mockDs.description, refreshInterval: mockDs.refreshInterval}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.ok(data.validationResult.valid, "Expected A Valid Response");

      done();
    });
  },
  "test validate environment data source invalid": function(done){
    appformsEnvDataSources.validate({environment: mockEnvId, name: mockDs.name, serviceGuid: mockDs.serviceGuid, endpoint: mockDs.endpoint, description: mockDs.description, refreshInterval: mockDs.refreshInterval}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.ok(data.data, "Expected A Data Response");

      done();
    });
  },
  "test refresh environment data source": function(done){
    appformsEnvDataSources.refresh({environment: mockEnvId, id: mockDs._id}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.ok(data.data, "Expected A Data Response");

      done();
    });
  },
  "test get data source audit logs": function(done){
    appformsEnvDataSources.auditLogs({environment: mockEnvId, id: mockDs._id}, function(err, data){
      assert.ok(!err, "Expected No Error " + err);
      assert.equal(data._id, mockDs._id);
      assert.ok(data.data, "Expected A Data Response");
      assert.ok(data.data.auditLogs, "Expected A Data Source Audit Log Response");

      done();
    });
  }
};
