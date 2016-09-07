var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_logs');
var adminLogs = {
  syslogs: genericCommand(require('cmd/fh3/admin/logs/syslogs'))
};


module.exports = {
  'test search for logs': function(done) {
    var mockRequestId = "somerequestidtosearch";
    adminLogs.syslogs({
      requestId: mockRequestId,
      projects: "core,mbaas"
    }, function(err, searchResponse){
      assert.ok(!err, "Expected no error " + err);

      //The search response should be JSON
      assert.ok(searchResponse, "Expected a search response");

      assert.equal(mockRequestId, searchResponse.hits.hits[0]._source.reqId);

      //There should be a table.
      assert.ok(searchResponse._table, "Expected a table for the search response");

      assert.ok(searchResponse._table.toString().indexOf('Error reading environment') > -1);
      done();
    });
  }
};