
module.exports = user;
user.usage = "fh user";
user.desc = "User information";

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var util = require("util");
var keys = require("./keys/user.js");
var targets = require('../fhc/targets');

// main user entry point
function user (argv, cb) {
  var args = argv._;
  var cookie = fhc.config.get("cookie");
  var version = fhc.config.get('fhversion');
  var errMsg = "You are not logged in. Login with fh login <user> <passwd> or fh keys user target <api-key>.";
  if (!version){
    return cb(undefined, errMsg);
  }
  var apiKey;
  if (cookie === undefined || '' === cookie) {
    apiKey = keys.getUserApiKey();
    if(apiKey === undefined || '' === apiKey){
      user.message = errMsg;
      return cb(undefined, errMsg);
    }
  }

  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/user/read", function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (remoteData.status === 'error' && remoteData.msg && remoteData.msg[0] && remoteData.msg[0].indexOf('Operation not permitted') !== -1) {
      user.message = "Not logged in";
    }else {
      user.message = remoteData.userName + " [" + remoteData.email + "]";
    }
    return cb(err, remoteData);
  });
}
