var genericCommand = require('genericCommand');
var assert = require('assert');
require('test/fixtures/user/fixture_user');

var sshCommand = {
  list: genericCommand(require('cmd/fh3/keys/ssh/list')),
  delete: genericCommand(require('cmd/fh3/keys/ssh/delete')),
  add: genericCommand(require('cmd/fh3/keys/ssh/add'))
};

var pathTest = 'test/fixtures/user/key.pub';

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/ide/apps/user/removeKey')
  .times(2)
  .reply(200, {})
  .post('/box/srv/1.1/ide/apps/user/addKey')
  .reply(200, {});

module.exports = {
  'test fhc keys ssh list' : function(cb) {
    sshCommand.list({}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'My_Personal_Key_1472563094058');
      assert.equal(table['0'][1], 'ssh-rsaXXXXXXXXXXXXXXXXXX.....XXXXXXXXXXXXXXXXXXXX');
      return cb();
    });
  },
  'test fhc keys ssh list --json' : function(cb) {
    sshCommand.list({json:true}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc keys ssh add --label --file' : function(cb) {
    sshCommand.add({label:"test", file:pathTest}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'fhc keys ssh delete --label' : function(cb) {
    sshCommand.delete({label:"My_Personal_Key_1472563094058"}, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
