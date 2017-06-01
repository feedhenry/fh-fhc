var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/connections/fixture_connections');

var connectionsCmd = {
  list: genericCommand(require('cmd/fh3/connections/list'))
};

module.exports = {
  'test connections list project ': function(cb) {
    connectionsCmd.list({ project: 'gz6uwsg7peooxyslv7aqglry'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '3zjasql3lparv4jfx7waxh4e');
      assert.equal(table['0'][1], 'dev');
      assert.equal(table['0'][2], '0.0.3');
      assert.equal(table['0'][3], 'android');
      assert.equal(table['0'][4], 'gz6uwsbecxi3xusncagc5o25');
      assert.equal(table['0'][5], 'gz6uwsbeqfpp5fpddw426ns2');
      assert.equal(table['0'][6], 'ji5s7opcnzcf37bgtnm2xxai');
      assert.equal(table['0'][7], 'ACTIVE');
      return cb();
    });
  }
};