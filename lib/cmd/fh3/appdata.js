module.exports = appdata;

appdata.desc = "Export FeedHenry MBaaS Apps";
appdata.usage = "fhc appdata [cmd]"
    + "\nfhc appdata export --app=<app> --env=<environment>"
    + "\nfhc appdata list"
    + "\nfhc appdata download --app=<app> --env=<environment> --app=<app> --file=<oath> --job=<job-id>"
    + "\nwhere <job-id> is the auto generated job id"
    + "\nwhere <path> is the file path where the export data should be saved."
    + "\nwhere <app> is the app id"
    + "\nwhere <environment> is the environment id";

var common = require("../../common");
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require('../../utils/ini');
var _ = require('underscore');
var templates = require('../common/templates.js');
var readline = require('readline');
var fs = require('fs');

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
  var appId = args.app;
  var envId = args.env;
  var inputError = validateDefaultInput({app: appId, env: envId});

  if (inputError) {
    return cb(inputError);
  }

  var path = 'api/v2/appdata/' + envId + '/' + appId + '/data/export';
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
  var appId = args.app;
  var envId = args.env;
  var path = 'api/v2/appdata/' + envId + '/' + appId + '/data/export';
  var inputError = validateDefaultInput({app: appId, env: envId});

  if (inputError) {
    return cb(inputError);
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  var question = [
    'Do you want to stop the application first?',
    'The application data might be outdated if you choose not to. (Y/N):'
  ].join('');

  rl.question(question, function(answer) {
    var apiData = {
      stopApp: shouldStopApp(answer)
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
  var appId = args.app;
  var envId = args.env;
  var jobId = args.job;
  var downloadFilePath = args.file;
  var path = 'api/v2/appdata/' + envId + '/' + appId + '/export/data/' + jobId;
  var inputError = validateDefaultInput({app: appId, env: envId});

  if (!jobId) {
    inputError += '--job argument is mandatory\n';
  }

  if (!downloadFilePath) {
    inputError += '--file argument is mandatory\n';
  }

  if (inputError) {
    return cb(inputError);
  }

  // First get the download URL
  common.doApiCall(fhreq.getFeedHenryUrl(), path, {}, 'Error retrieving download URL', function (err, res) {
    if (err) {
      return cb(err);
    }

    var params = {};
    params.url = res.url;
    params.method = 'GET';
    params.output = downloadFilePath;

    // Then download the file
    fs.stat(params.output, function(err) {
      if (!err) {
        return cb("The file at path " + params.output + " already exists.");
      }

      fhreq.downloadFile(params, cb);
    });
  });
}

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + appdata.usage);
}

function shouldStopApp(text) {
  if (!text) {
    return true;
  }

  var _text = text.toLowerCase();

  if (_text === 'y' || _text === 'yes') {
    return true;
  }

  return false;
}

function validateDefaultInput(options) {
  var errorMessage = '';

  if (!options.app) {
    errorMessage += '--app argument is mandatory.\n';
  }

  if (!options.env) {
    errorMessage += '--env argument is mandatory.\n';
  }

  return errorMessage;
}