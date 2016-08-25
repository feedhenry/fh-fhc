var assert = require('assert');
var create = require('cmd/fh3/admin/environments/create.js');
var environments = require('test/fixtures/admin/environments');
module.exports = {
  'test admin environments create command': function(cb) {
    environments.forEach(function(env) {
      // Set target to `id` to avoid calls to /api/v2/mbaases/[Object] in
      // check in `lib/utils/mbaas-token-check.js`
      env.target = env.target.id;
      create.preCmd(env, function(_, entity) {
        assert.equal(entity.id, env.id);
      });
    });
    return cb();
  }
};
