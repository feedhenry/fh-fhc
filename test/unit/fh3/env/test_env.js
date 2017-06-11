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
  delete: genericCommand(require('cmd/fh3/env/delete')),
  listDeployed: genericCommand(require('cmd/fh3/env/listDeployed'))
};

module.exports = {
  'test env create --app=<app> --name=<name> --env=<environment> --json': function(cb) {
    envCmd.create({app:'1a', name:'name', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test fhc env delete --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    envCmd.delete({app:'1a', id:'2b', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test fhc env list --app=<app> --env=<environment>': function(cb) {
    envCmd.list({app:'1a', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'cbh5jjpqdojimckeolw5yyib');
      assert.equal(table['0'][2], 'test3');
      assert.equal(table['0'][3], 'test');
      return cb();
    });
  },
  'test fhc env push --app=<app> --env=<environment>': function(cb) {
    envCmd.push({app:'1a', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test fhc env read --app=<app> --id=<id> --env=<environment>': function(cb) {
    envCmd.read({app:'1a', id:'2b', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test fhc env update --app=<app> --id=<id> --value=<value> --env=<environment> --json': function(cb) {
    envCmd.update({app:'1a', id:'2b', value:'value', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test fhc env unset --app=<app> --id=<id> --env=<environment> --json': function(cb) {
    envCmd.unset({app:'1a', id:'2b', env:'dev', json:true}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      assert.ok(data.status, "ok");
      return cb();
    });
  },
  'test listDeployed --app=<app> --includeSystemEnvironmentVariables=<true> --env=<environment>': function(cb) {
    envCmd.listDeployed({app:'1a', includeSystemEnvironmentVariables:true, env:'dev'}, function(err, data) {
      assert.equal(err, null);
      var table = data._table;
      assert.equal(table['0'][0], 'cbh5jjpqdojimckeolw5yyib');
      assert.equal(table['0'][2], 'test3');
      assert.equal(table['0'][3], 'test');
      return cb();
    });
  }
};