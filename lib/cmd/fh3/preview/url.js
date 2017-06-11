/* globals i18n */
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var util = require('util');

module.exports = {
  'desc' : i18n._('Show the App Preview URL of a client app'),
  'examples' :
    [{
      cmd : 'fhc preview url --app=<app>',
      desc : "Show the url preview of the app"
    }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    'json': 'j',
    0: 'app',
    1: 'json'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the application"),
    'json' : i18n._("Output in json format")
  },
  'customCmd' : function(params, cb) {
    var url = fhreq.getFeedHenryUrl() + 'box/srv/1.1/wid/' + fhc.curTarget + '/studio/' + params.app + '/container';
    if (!params.json) {
      return cb(null, util.format(i18n._("The URL to preview the app '%s' is '%s'"), params.app, url));
    } else {
      return cb(null, {url:url});
    }
  }
};