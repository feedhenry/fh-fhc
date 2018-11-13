var assert = require('assert');
var genericCommand = require('genericCommand');
var fixture_credentials = require('test/fixtures/credential/fixture_credentials.js');
var fs = require('fs');

var credentials = {
  list : genericCommand(require('cmd/fh3/credential/list')),
  create : genericCommand(require('cmd/fh3/credential/create')),
  delete : genericCommand(require('cmd/fh3/credential/delete')),
  download : genericCommand(require('cmd/fh3/credential/download'))
};

var pathTest = 'test/fixtures/credential/test.certificate';


var testOutputZipFile = 'testoutput';

module.exports = {
  'test credential list': function(cb) {
    credentials.list({}, function(err, data) {
      assert.equal(err, null);
      assert.notEqual(data, null);
      return cb();
    });
  },
  'test credential delete': function(cb) {
    credentials.delete({ id: '1a' }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test credential download': function(cb) {
    credentials.download({ id: '1a', output:testOutputZipFile}, function(err) {
      assert.equal(err, null);
      //Cleaning up the output file if it exists.
      fs.unlink(testOutputZipFile, function() {
        cb();
      });
    });
  },
  'test credential create android': function(cb) {
    credentials.create({
      name: "testCredentials",
      platform: "android",
      privatekey: pathTest,
      certificate: pathTest
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  },
  'test credential create ios check missed parameter --provisioning.': function(cb) {
    credentials.create({
      name: "testCredentials",
      platform: "ios",
      privatekey: pathTest,
      certificate: pathTest
    }, function(err) {
      assert.notEqual(err, null, "Missed parameter --provisioning.");
      return cb();
    });
  },
  'test credential create ios': function(cb) {
    credentials.create({
      name: "testCredentials",
      platform: "ios",
      privatekey: pathTest,
      certificate: pathTest,
      provisioning: pathTest
    }, function(err) {
      assert.equal(err, null);
      return cb();
    });
  }
};
