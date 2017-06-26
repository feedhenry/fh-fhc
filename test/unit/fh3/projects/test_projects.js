var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/projects/fixture_projects');

var allServicesCmd = {
  read: genericCommand(require('cmd/fh3/projects/read')),
  delete: genericCommand(require('cmd/fh3/projects/delete')),
  update: genericCommand(require('cmd/fh3/projects/update'))
};

var mockService = require('test/fixtures/projects/fixture_project').get();


module.exports = {
  "test fhc projects delete --project": function(cb) {
    allServicesCmd.delete({project:mockService.guid}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc projects update --project --propName --propValue": function(cb) {
    allServicesCmd.update({project:"2a", propName:"propName", propValue:"propValue"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  "test fhc projects read --project": function(cb) {
    allServicesCmd.read({project:'1a'}, function(err,data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      return cb();
    });
  }
};