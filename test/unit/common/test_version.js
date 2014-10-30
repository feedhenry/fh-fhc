var assert = require('assert');
var fhc = require("fhc.js");
var genericCommand = require('genericCommand');
var version = genericCommand(require('cmd/common/version.js'));
var versionNock = require('test/fixtures/fixture_version');

module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test version': function(cb) {
    // test version
    version({ _ : []}, function (err, data) {
      assert.equal(err, null, err);
      assert.ok(data);
      return cb();
    });        
  },
  tearDown : function(cb){
    versionNock.done();
    return cb();
  }
};
