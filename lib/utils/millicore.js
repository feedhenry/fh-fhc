/* globals i18n */

var fhreq = require("./request");
var fhc = require("../fhc");
var util = require('util');

exports.widgForAppId = function (appId, cb) {
  // TODO - this can be got from a local cache!
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/app/read"
    , {guid:appId}
    , function (error, data, json) {
      if (error) return cb(error, null);
      var js;
      try {
        js = JSON.parse(json);
      } catch (x) {
        return cb(i18n._("Error reading JSON response: ") + util.inspect(x)  + "\n" + i18n._("Response: ") + json);
      }
      if (js.status === "error") {
        return cb(js.message, null);
      }
      return cb(null, js.app.guid);
    }
    );
};

