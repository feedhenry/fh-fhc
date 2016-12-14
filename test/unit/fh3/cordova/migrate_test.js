var assert = require('assert');
var genericCommand = require('genericCommand');
var nockCordovaMigrate = require('test/fixtures/cordova/fixture_migrate');
var migrate = genericCommand(require('cmd/fh3/cordova/migrate'));
module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test cordova migrate': function(cb) {
    migrate({app : '1a'}, function (err, data){
      assert.equal(err, null, err);
      assert(data.ok === true);
      return cb();
    });
  },
  tearDown : function(cb){
    nockCordovaMigrate.done();
    return cb();
  }
};
