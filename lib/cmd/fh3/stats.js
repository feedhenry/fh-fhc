/* globals i18n */
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common.js");

module.exports = {
  'desc' : i18n._('Feedhenry cloud application statistics, counters & timers'),
  'examples' :
    [{
      cmd : 'fhc stats --app=<app> --type=<type> --num=<num> --env=<environment>',
      desc : "Delete the credential bundle with the id=<bundle-id>"
    }],
  'demand' : ['app','type','num','env'],
  'alias' : {
    'app': 'a',
    'type': 't',
    'num': 'n',
    'env': 'e',
    0: 'app',
    1: 'type',
    2: 'num',
    3: 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the application"),
    'type' : i18n._("Type of the stats."),
    'num' : i18n._("Number of result that you expected"),
    'env' : i18n._("Environment where the app is deployed and do you want the stats")
  },
  'customCmd': function(params, cb) {
    var url ="box/srv/1.1/ide/" + fhc.curTarget + "/app/stats";
    var payload = {payload: {guid: params.app, deploytarget: params.env, statstype: params.type, count: params.num}};
    common.doApiCall(fhreq.getFeedHenryUrl(),url, payload, i18n._("Error reading app statistics: "), cb, function(err, data) {
      if (err) {
        return cb(err);
      }
      return cb(err, data);
    });
  }
};