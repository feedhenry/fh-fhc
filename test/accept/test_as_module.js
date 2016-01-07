var assert = require('assert');
var nockLogs = require('test/fixtures/app/fixture_logs');
var fhc = require('lib/fhc');
//var ini = require('lib/utils/ini.js');
module.exports = {
  setUp : function(cb){
    return cb();
  },
  'test common logs': function(cb) {
    fhc.load(function(){
      // In-memory reroute our domain so our nock takes effect
      fhc.config.set('feedhenry', 'https://apps.feedhenry.com');
      fhc.config.set('domain', 'apps');
      fhc.app.logs.list({ app : '1a2b3c4d5e6f7g8e9f0a1b2c', env : 'dev'}, function(err, logData){
        assert.equal(err, null, err);
        assert(logData.status === 'ok');
        assert(logData.log.hasOwnProperty('stdout'));
        assert(logData.log.hasOwnProperty('stderr'));
        nockLogs.done();
        return cb();
      });
    });
  },
  tearDown : function(cb){
    nockLogs.done();
    return cb();
  }
};
