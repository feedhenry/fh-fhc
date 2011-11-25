
var fhreq = require("./request");
var log = require("./log");
var fhc = require("../fhc");

exports.widgForAppId = function (appId, cb) {
  // 
  // TODO - this can be got from a local cache!
  //
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/read"
    , {guid:appId}
    , function (error, data, json, response) {
        if (error) return cb(error, null);
        var js; 
        try {
          js = JSON.parse(json); 
        } catch (x) {
          return cb("Error reading JSON response: " + util.inspect(x)  + "\nResponse: " + json);
        }
        if (js.status == "error") return cb(js.message, null);
        return cb(null, js.app.guid);
      }
    );
};

