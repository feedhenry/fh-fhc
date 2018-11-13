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
    }, function(err, searchResponse) {
      assert(!err, "Expected no error " + err);

      //The search response should be JSON
      assert(searchResponse, "Expected a search response");

      assert(mockRequestId, searchResponse.hits.hits[0]._source.reqId);

      //There should be a table.
      assert(searchResponse._table, "Expected a table for the search response");

      assert(searchResponse._table.toString().indexOf('Error reading environment') > -1);
      done();
    });
  }
};