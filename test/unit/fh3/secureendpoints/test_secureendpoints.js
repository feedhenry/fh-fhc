var assert = require('assert');
var genericCommand = require('genericCommand');
require('test/fixtures/secureendpoints/fixture_secureendpoints');
var secureendpoints = {
  list : genericCommand(require('cmd/fh3/secureendpoints/list')),
  get : genericCommand(require('cmd/fh3/secureendpoints/get')),
  auditlog : genericCommand(require('cmd/fh3/secureendpoints/auditlog')),
  remove : genericCommand(require('cmd/fh3/secureendpoints/removeoverride')),
  default : genericCommand(require('cmd/fh3/secureendpoints/setdefault')),
  override : genericCommand(require('cmd/fh3/secureendpoints/setoverride'))
};

module.exports = {
  'test fhc secureendpoints auditlog --app=<app-id> --env=<environment>': function(cb) {
    secureendpoints.auditlog({app:'1a',env:'dev'}, function(err,data) {
      assert.equal(err, null);
      assert.ok(data._table, "Data table is Expected");
      assert.equal(data.status, "ok");
      var table = data._table;
      assert.equal(table['0'][0], 'Add Endpoint');
      assert.equal(table['0'][1], '/hello');
      assert.equal(table['0'][2], 'https');
      assert.equal(table['0'][3], 'cmacedo@redhat.com');
      assert.equal(table['0'][4], 'Fri Jun 16 11:28:49 UTC 2017');
      return cb();
    });
  },
  'test fhc secureendpoints auditlog --app=<app-id> --env=<environment> --json': function(cb) {
    secureendpoints.auditlog({app:'1a',env:'dev',json:true}, function(err,data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data table is not Expected");
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'test fhc secureendpoints list --app=<app-id> --env=<environment>': function(cb) {
    secureendpoints.list({app:'1a',env:'dev'}, function(err,data) {
      assert.equal(err, null);
      assert.ok(data._table, "Data _table is Expected");
      var table = data._table;
      assert.equal(table['0'][0], '/hello');
      assert.equal(table['0'][1], 'https');
      assert.equal(table['0'][2], 'cmacedo@redhat.com');
      assert.equal(table['0'][3], 'Fri Jun 16 11:28:49 UTC 2017');
      return cb();
    });
  },
  'test fhc secureendpoints list --app=<app-id> --env=<environment> --json': function(cb) {
    secureendpoints.list({app:'1a',env:'dev',json:true}, function(err,data) {
      assert.equal(err, null);
      assert.ok(!data._table, "Data _table is not Expected");
      assert.equal(data.status, "ok");
      assert.ok(data.overrides, "Data overrides are expected.");
      return cb();
    });
  },
  'test fhc secureendpoints get --app=<app-id> --env=<environment>': function(cb) {
    secureendpoints.list({app:'1a',env:'dev'}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data.default, "appapikey");
      return cb();
    });
  },
  'test fhc secureendpoints get --app=<app-id> --env=<environment> --json': function(cb) {
    secureendpoints.list({app:'1a',env:'dev',json:true}, function(err,data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'test fhc secureendpoints  remove-override --app=<app-id> --endpoint=<endpoint> --env=<environment>': function(cb) {
    secureendpoints.remove({app:'1a',endpoint:'2b', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'test fhc secureendpoints set-override --app=<app-id> --endpoint=<endpoint> --security=<security> --env=<environment>': function(cb) {
    secureendpoints.override({app:'1a',endpoint:'2b',security:'https', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  },
  'test fhc secureendpoints set-default --app=<app-id> --default=<default> --env=<environment>': function(cb) {
    secureendpoints.default({app:'1a',default:'appapikey', env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      assert.equal(data.default, "appapikey");
      return cb();
    });
  }
};