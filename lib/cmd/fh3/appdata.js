module.exports = appdata;

appdata.desc = "Export FeedHenry MBaaS Apps";
appdata.usage = "fhc appdata [cmd]"
    + "\nfhc appdata export --app=<app> --env=<environment>"
    + "\nfhc appdata list"
    + "\nfhc appdata download --job=<job-id>"
    + "\nwhere <job-id> is the auto generated job id"
    + "\nwhere <app> is the app id"
    + "\nwhere <environment> is the environment id";

var common = require("../../common");
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require('../../utils/ini');
var _ = require('underscore');
var templates = require('../common/templates.js');
var readline = require('readline');

var cmdRef = {
  'list': listAppData,
  'export': exportAppData,
  'download': downloadAppData,
  'unknown': unknown
};

function appdata(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return unknown("", cb);
  }

  var action = args[0];
  var fn = cmdRef[action];

  if (!fn) {
    return unknown("Invalid service action " + action, cb);
  }

  return fn(argv, cb);
}

function listAppData(args, cb) {
  var app = args.app;
  var env = args.env;
  var path = 'api/v2/appdata/' + env + '/' + app + '/data/export';
  common.doGetApiCall(fhreq.getFeedHenryUrl(), path, 'Error exporting data: ', onDone);

  function onDone(err, data) {
    if (err) {
      return cb(err);
    }

    if (ini.get('table') === true) {
      appdata.table = common.createTableForAppData(data);
    }

    if (ini.get('bare') !== false) {
      var props = ['guid'];
      if (typeof ini.get('bare') === 'string') {
        props = ini.get('bare').split(" ");
      }
      appdata.bare = '';
      _.each(data, function(proj) {
        if (appdata.bare !== '') {
          appdata.bare = appdata.bare + '\n';
        }

        for (var i=0; i < data.length; i++) {
          appdata.bare = appdata.bare + data[props[i]] + " ";
        }
      });
    }

    return cb(null, data);
  }
}

function exportAppData(args, cb) {
  var app = args.app;
  var env = args.env;
  var path = 'api/v2/appdata/' + env + '/' + app + '/data/export';
  
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var question = 'Do you want to stop the application first?' +
    'The application data might be outdated if you choose not to. (Y/N):'; 

  rl.question(question, function(answer) {
    var apiData = {
      stopApp: (answer.toLowerCase() === 'y'? true : false)
    };

    common.doApiCall(fhreq.getFeedHenryUrl(), path, apiData, 'Error exporting data: ', onDone);

    rl.close();
  });

  function onDone (err, result) {
    if (err) {
      return cb(err);
    }

    return cb(null, 'Job ID: ' + result);
  }
}

function downloadAppData(args, cb) {
  var app = args.app;
  var env = args.env;
  var job = args.job;
  var path = 'api/v2/appdata/' + env + '/' + app + '/export/data/' + job;
  common.doApiCall(fhreq.getFeedHenryUrl(), path, {}, 'Error exporting data: ', onDone);

  function onDone(err, res) {
    if (err) {
      return cb(err);
    }

    return cb(null, 'Download URL: ' + res.url);
  }
}

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + appdata.usage);
}
