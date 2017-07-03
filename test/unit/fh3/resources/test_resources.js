var assert = require('assert');
var genericCommand = require('genericCommand');
var setCmd = genericCommand(require('cmd/fh3/resources/cache/set'));
var flushCmd = genericCommand(require('cmd/fh3/resources/cache/flush'));

var nock = require('nock');
var dataSet = {
  "dyno": "support-dev",
  "dynoDir": "/opt/feedhenry/fh-dynoman/data/support-dev/",
  "host": "172.22.0.5",
  "veth": "172.22.0.6",
  "broadcast": "172.22.0.7",
  "limits": {
    "cpu": "512",
    "cpuset": "1",
    "ram": "1024M",
    "swap": "512M",
    "disk": "5120M",
    "cache": {
      "type": "percent",
      "value": 50
    }
  },
  "name": "support-dev",
  "expectedRunState": "RUNNING",
  "state": "RUNNING"
};

module.exports = nock('https://apps.feedhenry.com')
  .post('/api/v2/resources/apps/dev/cache/set')
  .reply(200, dataSet);

module.exports = {
  'fhc resources cache set --env=<environment> --type=<type> --value=<value>': function(cb) {
    setCmd({env:'dev',type:'percent',value:50}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.state,"RUNNING");
      return cb();
    });
  }
};