var assert = require('assert');
var genericCommand = require('genericCommand');
var listNotCmd = genericCommand(require('cmd/fh3/notifications/list'));
require('test/fixtures/notifications/fixture_notifications.js');
module.exports = {
  'test not found notifications list --app --env': function(cb) {
    listNotCmd({app:'1a',env:'test'}, function(err, data) {
      assert.ok(err, "Expected An Error ");
      assert.ok(!data, "Expected No Data");
      return cb();
    });
  },
  'test found notifications list --app --env with table output': function(cb) {
    listNotCmd({app:'1a',env:'test'}, function(err, data) {
      assert.ok(!err, "No Error is Expected");
      assert.ok(data, "Data is Expected");
      var table = data._table;
      assert.equal(table['0'][0], 'i4v54cybtabwhug5xzjg23o2');
      assert.equal(table['0'][2], 'System');
      assert.equal(table['0'][3], 'START_SUCCESSFUL');
      assert.equal(table['0'][4], 'App started');
      return cb();
    });
  },
  'test found notifications list --app --env with json output': function(cb) {
    listNotCmd({app:'1a',env:'test', json:true}, function(err, data) {
      assert.ok(!err, "No Error is Expected");
      assert.ok(data, "Data is Expected");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test found notifications list --app --env --audit with table output': function(cb) {
    listNotCmd({app:'1a',env:'test', audit:true}, function(err, data) {
      assert.ok(!err, "No Error is Expected");
      assert.ok(data, "Data is Expected");
      var table = data._table;
      assert.equal(table['0'][0], 'i4v54cybtabwhug5xzjg23o2');
      assert.equal(table['0'][2], 'System');
      assert.equal(table['0'][3], 'START_SUCCESSFUL');
      assert.equal(table['0'][4], 'App started');
      return cb();
    });
  },


};