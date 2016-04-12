var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_environments');
var adminenvironments = {
  create: genericCommand(require('cmd/fh3/admin/environments/create')),
  read: genericCommand(require('cmd/fh3/admin/environments/read')),
  update: genericCommand(require('cmd/fh3/admin/environments/update')),
  delete: genericCommand(require('cmd/fh3/admin/environments/delete')),
  list: genericCommand(require('cmd/fh3/admin/environments/list'))
};


module.exports = {
  'test admin-environments list': function(cb) {
    adminenvironments.list({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.length, 2);
      assert.equal(data[0].label, 'lbl1');
      assert.equal(data[1].label, 'lbl2');

      var table = data._table;
      assert.equal(table['0'][2], false);
      assert.equal(table['0'][3], false);

      assert.equal(table['1'][2], true);
      assert.equal(table['1'][3], true);
      return cb();
    });
  },
  'test admin-environments read': function(cb) {
    adminenvironments.read({ id: '1a'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.label, 'lbl1');
      return cb();
    });
  },
  'test admin-environments create': function(cb) {
    adminenvironments.create({ label: 'lbl1', target: 'testTarget1', id: '1a' }, function(err, data) {
      assert.equal(err, null);

      assert.equal(data.target.id, 'testTarget1');
      assert.equal(data.label, 'lbl1');
      assert.equal(data.id, '1a');
      return cb();
    });
  },
  'test admin-environments update': function(cb) {
    adminenvironments.update({ label: 'lbl1', target: 'testTarget1', id: '1a' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test admin-environments delete': function(cb) {
    adminenvironments.delete({ id: '1a' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
