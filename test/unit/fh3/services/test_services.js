var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/services/fixture_services');

var allServicesCmd = {
  read: genericCommand(require('cmd/fh3/services/read')),
  delete: genericCommand(require('cmd/fh3/services/delete')),
  update: genericCommand(require('cmd/fh3/services/update')),
  datasources: genericCommand(require('cmd/fh3/services/data-sources'))
};

var mockService = require('test/fixtures/services/fixture_service').get();


module.exports = {
  "test fhc data-sources --service": function(cb) {
    allServicesCmd.datasources({service:mockService.guid}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'somedatasource');
      assert.equal(table['0'][1], 'Some Data Source');
      assert.equal(table['0'][2], 'someserviceguid');
      assert.equal(table['0'][3], 'Mock Service');
      assert.equal(table['0'][4], '/someendpoint');
      assert.equal(table['0'][5], 'a minute');
      assert.equal(table['0'][6], 100);
      return cb();
    });
  },
  "test fhc services delete --service": function(cb) {
    allServicesCmd.delete({service:mockService.guid}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc services update --service --propName --propValue": function(cb) {
    allServicesCmd.update({service:"2a", propName:"propName", propValue:"propValue"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc services read --service": function(cb) {
    allServicesCmd.read({service:'1a'}, function(err,data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      return cb();
    });
  }
};