var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/admin/fixture_teams');
var adminteams = {
  list: genericCommand(require('cmd/fh3/admin/teams/list')),
  read: genericCommand(require('cmd/fh3/admin/teams/read')),
  create: genericCommand(require('cmd/fh3/admin/teams/create')),
  delete: genericCommand(require('cmd/fh3/admin/teams/delete')),
  adduser: genericCommand(require('cmd/fh3/admin/teams/adduser')),
  removeuser: genericCommand(require('cmd/fh3/admin/teams/removeuser')),
  userteams: genericCommand(require('cmd/fh3/admin/teams/userteams'))
};

var CONFIGURATION_FILE = "test/fixtures/admin/myteam.json";

module.exports = {
  'test fhc admin teams list': function(cb) {
    adminteams.list({}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.length, 2);

      var table = data._table;

      assert.equal(table['0'][0], '5502e3155afd8f2a5b44c065');
      assert.equal(table['0'][1], 'Owner Only (support domain)');

      assert.equal(table['1'][0], '552d0926d471ccc066a6919d');
      assert.equal(table['1'][1], 'OpenShift Team (support domain)');
      return cb();
    });
  },
  'test fhc admin teams read id': function(cb) {
    adminteams.read({ id: '1a'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
  ,
  'test fhc admin teams create team=myteam.json': function(cb) {
    adminteams.create({ team: CONFIGURATION_FILE }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin teams delete id': function(cb) {
    adminteams.delete({ id: '1a' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin teams adduser team=1a user=2b': function(cb) {
    adminteams.adduser({ team: '1a', user: '2b' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test fhc admin teams removeuser team=1a user=2b': function(cb) {
    adminteams.removeuser({ team: '1a', user: '2b' }, function(err) {
      console.log(err);
      assert.equal(err, null);
      return cb();
    });
  },
  'test admin teams userteams user=1a2b': function(cb) {
    adminteams.userteams({ user: '1a2b' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
