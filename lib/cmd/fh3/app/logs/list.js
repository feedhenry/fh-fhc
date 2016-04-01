/* globals i18n */
var fhc = require("../../../../fhc");
var ini = require('../../../../utils/ini');
var common = require("../../../../common");
var Table = require('cli-table');
var moment = require('moment');
var _ = require('underscore');

module.exports = {
  'desc': i18n._('Get list of application log files'),
  'examples': [{
    cmd: 'fhc app logs list --app=2bf4gg3gfefsdgfdsg4fdgs34 --env=dev',
    desc: i18n._('Fetch list of application log files for "dev" environment\n')
  }],
  'demand': ['app', 'env'],
  'alias': {
    'app': 'a',
    'env': 'e',
    0: 'app',
    1: 'env'
  },
  'describe': {
    'app': i18n._('Unique 24 character GUID of your application.'),
    'env': i18n._('Application Environment ID (dev, prod)')
  },
  'method': 'GET',
  'url': function (argv) {
    return "api/v2/mbaas/" + fhc.curTarget + "/" + argv.deploytarget + "/apps/" + fhc.appId(argv.guid) + "/logs";
  },
  'preCmd': function (params, cb) {
    var payload = {
      "guid": params.app,
      "deploytarget": params.env
    };
    return cb(null, payload);
  },
  'customCmd': function (params, cb) {
    this.executeStandardRequest(params, function (err, result) {
      if (result && result.logs) {
        if (ini.get('table') === true) {
          createTableForLogs(result);
        }
      }
      cb(err, result);
    });
  }
};

function createTableForLogs(result) {
  var logz = result.logs;
  result._table = new Table({
    head: ['Name', 'Size', 'Modified'],
    style: common.style()
  });
  var dateFormat = fhc.config.get("dateformat");

  _.each(logz, function (tmpLog) {
    var logDate = moment(tmpLog.modified).format(dateFormat);
    result._table.push([tmpLog.name, tmpLog.size, logDate]);
  });
}
