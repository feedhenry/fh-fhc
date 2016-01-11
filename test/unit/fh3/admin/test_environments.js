var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_environments');
var adminenvironments = {
  create : genericCommand(require('cmd/fh3/admin/environments/create')),
  read : genericCommand(require('cmd/fh3/admin/environments/read')),
  update : genericCommand(require('cmd/fh3/admin/environments/update')),
  delete : genericCommand(require('cmd/fh3/admin/environments/delete')),
  list : genericCommand(require('cmd/fh3/admin/environments/list'))
};


module.exports = {
    'test admin-environments list': function(cb) {
      adminenvironments.list({}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.length, 1);
        assert.equal(data[0].label, 'My env');
        return cb();
      });
    },
    'test admin-environments read': function(cb) {
      adminenvironments.read({ id : '1a'}, function (err, data){
        assert.equal(err, null);
        assert.equal(data.label, 'My env');
        return cb();
      });
    },
    'test admin-environments create': function(cb) {
      adminenvironments.create({ label : 'foo', targets : '1,2,3', id : '1a' }, function (err, data){
        assert.equal(err, null);
        assert.equal(data.label, 'My env');
        return cb();
      });
    },
    'test admin-environments update': function(cb) {
      adminenvironments.update({ label : 'foo', targets : '1,2,3', id : '1a' }, function (err){
        assert.equal(err, null);
        return cb();
      });
    },
    'test admin-environments delete': function(cb) {
      adminenvironments.delete({ id : '1a' }, function (err){
        assert.equal(err, null);
        return cb();
      });
    }
};
