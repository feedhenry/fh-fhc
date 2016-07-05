/* globals i18n */
module.exports = user;
user.usage = "fhc user";
user.desc = i18n._("User information");

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var keys = require("./keys/user.js");
var ini = require("../../utils/ini");

// main user entry point
function user(argv, cb) {
  var cookie = fhc.config.get("cookie");
  var version = fhc.config.get('fhversion');
  var errMsg = i18n._("You are not logged in. Login with fhc login <user> <passwd> or fhc keys user target <api-key>.");
  if (!version) {
    return cb(undefined, errMsg);
  }
  var apiKey;
  if (cookie === undefined || '' === cookie) {
    apiKey = keys.getUserApiKey();
    if (apiKey === undefined || '' === apiKey) {
      user.message = errMsg;
      return cb(undefined, errMsg);
    }
  }

  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/user/read", function (err, remoteData) {
    if (err) return cb(err);
    if (remoteData.status === 'error' && remoteData.msg && remoteData.msg[0] && remoteData.msg[0].indexOf('Operation not permitted') !== -1) {
      user.message = i18n._("Not logged in");
    } else {
      user.message = remoteData.userName + " [" + remoteData.email + "]";
    }

    if (remoteData.permissions) {
      ini.set("perms", remoteData.permissions);
    }

    return cb(err, remoteData);
  });
}
