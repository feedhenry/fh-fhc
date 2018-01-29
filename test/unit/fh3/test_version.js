var assert = require('assert');
var genericCommand = require('genericCommand');
var command = genericCommand(require('cmd/fh3/version'));

var data = {
  "name": "fh-ngui",
  "version": "5.9.18-a2579c5",
  "branch": "undefined",
  "commit": "undefined",
  "environment": "production",
  "platform": {
    "version": "3.18.2",
    "grid": {
      "id": "SAM",
      "name": "US-SAM",
      "region": "us-east-1"
    },
    "site": {
      "id": "sam1"
    },
    "env": {
      "id": "sam1-core",
      "name": "Core MAP (US-SAM)",
      "size": "g2.medium",
      "descr": "Shared Enterprise North America"
    }
  }
};

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .get('/sys/info/version')
  .times(2)
  .reply(200, data);

module.exports = {
  'test fhc version': function(cb) {
    command({}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data);
      return cb();
    });
  },
  'test fhc version --json': function(cb) {
    command({json:true}, function (err, data) {
      assert.equal(err, null);
      assert.ok(data);
      assert.equal(data.platformVersion, "3.18.2");
      return cb();
    });
  }
};
