var assert = require('assert');
var genericCommand = require('genericCommand');
var nockCloud = require('test/fixtures/app/cloud');
var act = genericCommand(require('cmd/fh3/app/act'));
module.exports = {
    'test fh3 act': function(cb) {
      act({app : '1a', fn : 'somefunc', 'data' : '', 'env' : 'development'}, function (err, data){
        assert.equal(err, null, err);
        assert(data.ok === true);
        nockCloud.done();
        return cb();
      });
    }
};
