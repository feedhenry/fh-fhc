var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/env/fixture_env.js');

var envCmd = {
  list: genericCommand(require('cmd/fh3/env/list')),
  update: genericCommand(require('cmd/fh3/env/update')),
  create: genericCommand(require('cmd/fh3/env/create')),
  push: genericCommand(require('cmd/fh3/env/push')),
  read: genericCommand(require('cmd/fh3/env/read')),
  unset: genericCommand(require('cmd/fh3/env/unset')),
  delete: genericCommand(require('cmd/fh3/env/delete'))
};


module.exports = {
  'test env create --app=<app> --name=<name> --env=<environment> --json': function(cb) {
    envCmd.create({app:'1a', name:'name', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc env delete --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    envCmd.delete({app:'1a', id:'2b', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc env list --app=<app> --env=<environment>': function(cb) {
    envCmd.list({app:'1a', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], '2b');
      assert.equal(table['0'][2], 'assa');
      assert.equal(table['0'][3], 'test2');
      assert.equal(table['1'][0], 'nqnbvq2u3lvmu2xnehvmtpca');
      assert.equal(table['1'][2], 'Test2');
      assert.equal(table['1'][3], '*');
      return cb();
    });
  },
  'test fhc env push --app=<app> --env=<environment>': function(cb) {
    envCmd.push({app:'1a', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      return cb();
    });
  },
  'test fhc env read --app=<app> --id=<id> --env=<environment>': function(cb) {
    envCmd.read({app:'1a', id:'2b', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      return cb();
    });
  },
  'test fhc env update --app=<app> --id=<id> --value=<value> --env=<environment> --json': function(cb) {
    envCmd.update({app:'1a', id:'2b', value:'value', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc env update --app=<app> --id=<id> --mask --json': function(cb) {
    envCmd.update({app:'1a', id:'2b', mask:true, env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.equal(data._table, null);
      return cb();
    });
  },
  'test fhc env unset --app=<app> --id=<id>': function(cb) {
    envCmd.unset({app:'1a', id:'2b'}, function(err, data) {
      assert.equal(err, null);
      return cb();
    });
  }
};


