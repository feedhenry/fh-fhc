
module.exports = user;
user.usage = "fhc user";

var fhc = require("./fhc");
var fhreq = require("./utils/request");
var util = require("util");

// main user entry point
function user (args, cb) {
  var cookie = fhc.config.get("cookie");
  if (cookie == undefined || '' == cookie) {
    var msg = "You are not logged in. Login with fhc login <user> <passwd>.";
    user.message = msg;
    return cb(undefined, msg);
  }

  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/user/read", function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (remoteData.status === 'error' && remoteData.msg && remoteData.msg[0] && remoteData.msg[0].indexOf('Operation not permitted') !== -1) {
      user.message = "Not logged in";
    }else {
      user.message = remoteData.userName + " [" + remoteData.email + "]"; 
    }
    return cb(err, remoteData);
  });
}
