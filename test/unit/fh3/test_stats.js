var assert = require('assert');
var genericCommand = require('genericCommand');
var statsCmd = genericCommand(require('cmd/fh3/stats'));

var data = {
  "interval": 10000,
  "results": [
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823640607
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 5,
      "timers": [],
      "ts": 1502823650609
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823660615
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823670617
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823680627
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823690636
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823700637
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 5,
      "timers": [],
      "ts": 1502823710638
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823720643
    },
    {
      "counters": [],
      "gauges": [],
      "numStats": 0,
      "timers": [],
      "ts": 1502823730645
    }
  ],
  "status": "ok"
};

var nock = require('nock');
module.exports = nock('https://apps.feedhenry.com')
  .post('/box/srv/1.1/ide/apps/app/stats')
  .reply(200, data);

module.exports = {
  'test stats --app--type --num --env': function(cb) {
    statsCmd.customCmd({app:'1a', type:'type', num:20, env:'dev'}, function(err, data) {
      assert.equal(err, null);
      assert.equal(data.status, "ok");
      return cb();
    });
  }
};