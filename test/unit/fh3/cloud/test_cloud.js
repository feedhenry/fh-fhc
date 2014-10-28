var assert = require('assert');
var genericCommand = require('genericCommand');
var nockCloud = require('test/fixtures/app/cloud');
var cloud = genericCommand(require('cmd/fh3/app/cloud'));
module.exports = {
    'test fh3 cloud': function(cb) {
      cloud({app : '1a', path : '/some/custom/cloud/host', 'data' : '', 'env' : 'development'}, function (err, data){
        assert.equal(err, null);
        assert(data.ok === true);
        nockCloud.done();
        return cb();
      });
    }
};
