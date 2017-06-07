var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
var statsCmd = genericCommand(require('cmd/fh3/stats'));

module.exports = {
  'test stats --app--type --num --env': function(cb) {
    statsCmd.customCmd({app:'1a', type:'type', num:20, env:'dev'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};