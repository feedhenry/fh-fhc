var assert = require('assert');
var genericCommand = require('genericCommand');

var appStoreItemCmd = {
  add: genericCommand(require('cmd/fh3/admin/appstore/item/add')),
  delete: genericCommand(require('cmd/fh3/admin/appstore/item/delete')),
  list: genericCommand(require('cmd/fh3/admin/appstore/item/list'))
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/appstore/additem')
  .reply(200, {})
  .post('/box/srv/1.1/admin/appstore/removeitem')
  .reply(200, {})
  .get('/box/srv/1.1/admin/appstore/liststoreitems')
  .reply(200, {});

module.exports = {
  'test fhc admin appstore item add --id --json': function(cb) {
    appStoreItemCmd.add({id:"policyid",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore item delete --id --json': function(cb) {
    appStoreItemCmd.delete({id:"policyid",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore item list --json': function(cb) {
    appStoreItemCmd.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  }
};