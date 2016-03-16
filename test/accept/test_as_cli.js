var exec = require('child_process').exec,
  assert = require('assert');
require('test/fixtures/app/fixture_logs');

module.exports = {
  setUp : function(cb){
    return cb();
  },
  "verify it works as a CLI with no arguments" : function(cb){
    exec('node bin/fhc.js',
      function (error, stdout, stderr) {
        //console.log('stdout: ' + stdout);
        assert.ok(stderr==='');
        assert.ok(stdout.length > 0);
        assert.ok(stdout.indexOf('Usage')>-1);
        return cb();
      });
  },
  "verify it works as a CLI with arguments" : function(cb){
    exec('node bin/fhc.js help app logs',
      function (error, stdout, stderr) {
        assert.ok(stderr==='', stderr);
        assert.ok(stdout.length > 0);
        return cb();
      });
  }
};
