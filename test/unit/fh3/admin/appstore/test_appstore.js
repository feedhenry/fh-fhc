var assert = require('assert');
var genericCommand = require('genericCommand');

var appStoreCmd = {
  read: genericCommand(require('cmd/fh3/admin/appstore/read')),
  update: genericCommand(require('cmd/fh3/admin/appstore/update')),
  updatefield: genericCommand(require('cmd/fh3/admin/appstore/updatefield'))
};

var nock = require('nock');

module.exports = nock('https://apps.feedhenry.com')
  .get('/box/srv/1.1/admin/appstore/read')
  .reply(200, {})
  .post('/box/srv/1.1/admin/appstore/update')
  .times(2)
  .reply(200, {});

module.exports = {
  'test fhc admin appstore read --json': function(cb) {
    appStoreCmd.read({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore update --name --description --apps --json': function(cb) {
    appStoreCmd.update({name:"name",description:"description",apps:"apps1,apps2",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  },
  'test fhc admin appstore updatefield  --name --value --json': function(cb) {
    appStoreCmd.updatefield({name:"name", value:"value",json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table,null);
      return cb();
    });
  }
};