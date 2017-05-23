var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_domains');
var admindomains = {
  create: genericCommand(require('cmd/fh3/admin/domains/create')),
  check: genericCommand(require('cmd/fh3/admin/domains/check'))
};


module.exports = {
  'test admin domains check domain': function(cb) {
    admindomains.check({domain:'testing'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.available, 'true');
      return cb();
    });
  },
  'test admin domains create name=test type=developer': function(cb) {
    admindomains.create({ id: 'test', type:'developer'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.domain, 'test');
      assert.equal(data.type, 'developer');
      return cb();
    });
  }
};
