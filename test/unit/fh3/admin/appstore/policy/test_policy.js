var assert = require('assert');
var genericCommand = require('genericCommand');

var appStorePolicyCmd = {
  add: genericCommand(require('cmd/fh3/admin/appstore/policy/add')),
  delete: genericCommand(require('cmd/fh3/admin/appstore/policy/delete')),
  list: genericCommand(require('cmd/fh3/admin/appstore/policy/list'))
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/admin/appstore/addpolicy')
  .reply(200, {})
  .post('/box/srv/1.1/admin/appstore/removepolicy')
  .reply(200, {})
  .get('/box/srv/1.1/admin/appstore/listpolicies')
  .reply(200, {});

module.exports = {
  'test fhc admin appstore policy add --id --json': function(cb) {
    appStorePolicyCmd.add({id:"policyid",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore policy delete --id --json': function(cb) {
    appStorePolicyCmd.delete({id:"policyid",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore policy list --json': function(cb) {
    appStorePolicyCmd.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  }
};