/* globals i18n */
var util = require('util');
var fhreq = require("../../../utils/request");
var fhc = require("../../../fhc");
var exec = require("../../../utils/exec.js");

module.exports = {
  'desc' : i18n._('Show the App Preview of a client app'),
  'examples' :
    [{
      cmd : 'fhc preview show --app=<app>',
      desc : "Show the preview of the <app>"
    }],
  'demand' : ['app'],
  'alias' : {
    'app': 'a',
    0: 'app'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of the application")
  },
  'customCmd' : function(params,cb) {
    var url = fhreq.getFeedHenryUrl() + 'box/srv/1.1/wid/' + fhc.curTarget + '/studio/' + params.app + '/container';
    exec(fhc.config.get("browser"), [url], function(err) {
      if (err) {
        cb(util.format(i18n._("Failed to open %s in a browser.  It could be that the\n" +
            "'browser' config is not set.  Try doing the following:\n" +
            "    fhc set browser google-chrome\n or:\n" +
            "    fhc set browser lynx\n"), url));
      } else {
        cb(undefined, {url: url});
      }
    });
  }
};