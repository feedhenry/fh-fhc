var fhc = require("../../../../fhc");
var _ = require('underscore');

module.exports = {
  'desc': 'Display the end part of application log file and monitor how it changes over the time.',
  'examples': [{
    cmd: 'fhc app logs tail --app=2bf4gg3gfefsdgfdsg4fdgs34 --env=dev --last=100 --logname=std.out.log',
    desc: 'Monitors and displays the last "100" lines of "std.out.log"'
  }],
  'demand': ['app', 'env'],
  'alias': {
    'app': 'a',
    'env': 'e',
    'last': 'l',
    'offset': 'o',
    'logname': 'f',
    0: 'app',
    1: 'env',
    2: 'last',
    3: 'offset',
    4: 'logname'
  },
  'describe': {
    'app': 'Unique 24 character GUID of your application.',
    'env': 'Application Environment ID (dev, prod)',
    'last': 'Number of last lines from file that will be fetched',
    'offset': 'Log file offset used as starting point for reading log',
    'logname': 'Name of log file'
  },
  'method': 'POST',
  'url': function (argv) {
    return "api/v2/mbaas/" + fhc.curTarget + "/" + argv.deploytarget + "/apps/" + fhc.appId(argv.guid) + "/logs/chunk";
  },
  'preCmd': function (params, cb) {
    var payload = {
      "guid": params.app,
      "action": "logchunk",
      "deploytarget": params.env
    };
    if (params.last) payload.last = params.last;
    if (params.offset) payload.offset = params.offset;
    if (params.logname) payload.logname = params.logname;

    return cb(null, payload);
  },
  'customCmd': function (params, cb) {
    var self = this;
    this.executeStandardRequest(params, function (err, result) {
      if (err) {
        cb(err, result);
      } else if (result && result.msg) {
        var msg = result.msg;
        if (msg.offset) {
          params.offset = msg.offset;
        }
        if (msg.data && msg.data.length !== 0) {
          var logString = msg.data.join("\n");
          console.log(logString);
        }
      }
      setTimeout(_.bind(self.customCmd, self, params, cb), 3000);
      // No callback (inifinite loop)
    });
  },
};
