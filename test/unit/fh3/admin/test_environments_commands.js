var assert = require('assert');
var create = require('cmd/fh3/admin/environments/create.js');
var environments = require('test/fixtures/admin/environments');
module.exports = {
  'test admin environments create command': function (cb) {
    // map fixture's fields to the ones that are going to come from the command line
    environments = environments.map(function (env) {
      env.id = env._id;
      // command expects `targets` to be a csv string
      env.targets = env.targets.join(',');
      return env;
    });

    environments.forEach(function (env) {
      create.preCmd(env, function (_, entity) {
        assert.equal(entity._id, env._id);
      });
    });
    return cb();
  }
};