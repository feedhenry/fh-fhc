
module.exports = user;
user.usage = "fhc user";

var fhc = require("./fhc");
var fhreq = require("./utils/request");
var util = require("util");

// main user entry point
function user (args, cb) {
  var cookie = fhc.config.get("cookie");
  if (cookie == undefined || '' == cookie) {
    return cb(undefined, "You are not logged in. Login with fhc login <user> <passwd>.");
  }

  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/user/read", function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
}
