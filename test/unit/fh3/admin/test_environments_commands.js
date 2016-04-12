var assert = require('assert');
var create = require('cmd/fh3/admin/environments/create.js');
var environments = require('test/fixtures/admin/environments');
module.exports = {
  'test admin environments create command': function(cb) {
    environments.forEach(function(env) {
      create.preCmd(env, function(_, entity) {
        assert.equal(entity.id, env.id);
      });
    });
    return cb();
  }
};