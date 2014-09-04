module.exports = ngui;
ngui.usage = "fhc ngui" +
             "\nfhc ngui enable  - enable FH3 for the current user" +
             "\nfhc ngui disable - disable FH3 for the current user";

var util = require('util');
var user = require('./user.js');
var common = require('./common.js');
var fhreq = require("./utils/request");
var fhc = require("./fhc");


// Command for telling us if we're in NGUI or not
function ngui(args, cb) {

  if (args[0] === 'enable') return enableNewStudioForUser(cb);
  if (args[0] === 'disable') return disableNewStudioForUser(cb);

  user([], function(err, user) {
    if (err) return cb(err);
    if (!user) return cb('No user details, possibly not logged in?');
    if (!user.prefs) return cb('No user prefs! - ' + util.inspect(user));
    if (user.prefs['studio.version'] === 'beta') return cb(null, true);
    else return cb(null, false);
  });
}

function enableNewStudioForUser(cb) {
  var payload = {"payload":{"key":"studio.version","value":"beta"}};
  makeCall(payload, cb);
}

function disableNewStudioForUser(cb) {
  var payload = {"payload":{"key":"studio.version","value":""}};
  makeCall(payload, cb);
}

function makeCall(payload, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.target + "/user/setProp", payload, "Error calling user props", function(err, data){
    if (err) return cb(err);
    return cb(null, data);
  });
}
