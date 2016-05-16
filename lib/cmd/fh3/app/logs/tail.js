/* globals i18n */
var fhc = require("../../../../fhc");
var _ = require('underscore');
var log = require("../../../../utils/log");

module.exports = {
  'desc': i18n._('Display the end part of application log files and monitor how it changes over the time. ' +
                 'By default command will display most recent stdout and stderr logs.'),
  'examples': [{
    cmd: 'fhc app logs tail --app=2bf4gg3gfefsdgfdsg4fdgs34 --env=dev --last=100 --logname=std.out.log',
    desc: i18n._('Monitors and displays the last "100" lines of "std.out.log"')
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
    'app': i18n._('Unique 24 character GUID of your application.'),
    'env': i18n._('Application Environment ID (dev, prod)'),
    'last': i18n._('Number of last lines from file that will be fetched'),
    'offset': i18n._('Log file offset used as starting point for reading log'),
    'logname': i18n._('Name of log file')
  },
  'method': 'POST',
  'url': function (argv) {
    return "api/v2/mbaas/" + fhc.curTarget + "/" + argv.deploytarget + "/apps/" + fhc.appId(argv.guid) + "/logs/chunk";
  },
  'preCmd': function (params, cb) {
    var stdRequest = {
      "guid": params.app,
      "action": "logchunk",
      "deploytarget": params.env
    };

    if (params.last) {
      stdRequest.last = params.last;
    }
    if (params.offset) {
      stdRequest.offset = params.offset;
    }
    if (params.logname) {
      stdRequest.logname = params.logname;
      return cb(null, stdRequest, null);
    }
    this.tailStdAndErrorLog(stdRequest,params, cb);
  },
  'tailStdAndErrorLog':function(stdRequest,params, cb){
    var self = this;
    var listParams = {
      "app": params.app,
      "env": params.env
    };
    fhc.app.logs.list(listParams, function(err, res){
      if(res && res.logs && res.logs.length > 1){
        var stdLog = self.getFirst(res.logs, "stdout.log.");
        var errorLog = self.getFirst(res.logs, "stderr.log.");
        var errorRequest = _.clone(stdRequest);
        stdRequest.logname = stdLog.name;
        errorRequest.logname = errorLog.name;
        log.warn(i18n._("No log file specified. Fetching logs from latest log files. \nStandard output: ") +
                 stdLog.name + i18n._("\nError log: ") + errorLog.name);
        return cb(null, stdRequest, errorRequest);
      }else{
        log.warn(i18n._("Cannot get latest log files. Fetching standard output log."));
        return cb(null, stdRequest, null);
      }
    });
  },
  'getFirst': function(list,name){
    return _.find(list, function(element){
      if(element.name.indexOf(name)===0){
        return true;
      }
    });
  },
  'customCmd': function(request, secondRequest, cb){
    this.execute(request, cb);
    // Tail second file (error log)
    if(secondRequest){
      this.execute(secondRequest, cb);
    }
  },
  'execute':function(params,cb){
    var self = this;
    self.executeStandardRequest(params, function (err, result) {
      if (err) {
        cb(err, result);
      } else if (result && result.msg) {
        var msg = result.msg;
        if (msg.offset) {
          params.offset = msg.offset;
        }
        if (msg.data && msg.data.length !== 0) {
          var logString = msg.data.join("\n");
          console.log(params.logname + ":");
          console.log(logString+"\n");
        }
      }
      setTimeout(_.bind(self.execute, self, params, cb), 4000);
      // No callback (inifinite loop)
    });
  }
};
