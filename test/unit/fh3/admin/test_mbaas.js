var assert = require('assert');
var genericCommand = require('genericCommand');
var _ = require('underscore');
require('test/fixtures/admin/fixture_mbaas');
var adminmbaas = {
  create : genericCommand(require('cmd/fh3/admin/mbaas/create')),
  read : genericCommand(require('cmd/fh3/admin/mbaas/read')),
  update : genericCommand(require('cmd/fh3/admin/mbaas/update')),
  delete : genericCommand(require('cmd/fh3/admin/mbaas/delete')),
  list : genericCommand(require('cmd/fh3/admin/mbaas/list'))
};
var anmBaaS = {url : 'http://mbaas.com', servicekey : 'svckey', id : '1a2b', username : 'test', password : 'test'};
module.exports = {
    'test admin-mbaas list': function(cb) {
      adminmbaas.list(_.clone(anmBaaS), function (err, data){
        assert.equal(err, null);
        assert.equal(data.length, 1);
        assert.equal(data[0].url, 'http://www.mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas read': function(cb) {
      adminmbaas.read(_.clone(anmBaaS), function (err, data){
        assert.equal(err, null);
        assert.equal(data.url, 'http://www.mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas create': function(cb) {
      adminmbaas.create(_.clone(anmBaaS), function (err, data){
        assert.equal(err, null);
        assert.equal(data.url, 'http://www.mbaas.com');
        return cb();
      });
    },
    'test admin-mbaas update': function(cb) {
      adminmbaas.update(_.clone(anmBaaS), function (err){
        assert.equal(err, null);
        return cb();
      });
    },
    'test admin-mbaas delete': function(cb) {
      adminmbaas.delete(_.clone(anmBaaS), function (err){
        assert.equal(err, null);
        return cb();
      });
    }
};
