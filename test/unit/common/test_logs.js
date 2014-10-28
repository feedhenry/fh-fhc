var assert = require('assert');
var nockLogs = require('test/fixtures/app/fixture_logs');
var logs = require('cmd/common/logs');
module.exports = {
    'test common logs': function(cb) {
      logs({_ : ['1a2b3c4d5e6f7g8e9f0a1b2c', 'dev']}, function (err, data){
        assert.equal(err, null, err);
        assert(data.status === 'ok');
        assert(data.log.hasOwnProperty('stdout'));
        assert(data.log.hasOwnProperty('stderr'));
        nockLogs.done();
        return cb();
      });
    }
};
