module.exports = ngui;
ngui.desc = "Check status, enable or disable FeedHenry version 3";
ngui.usage = "fhc ngui" +
             "\nfhc ngui enable  - enable FH3 for the current user" +
             "\nfhc ngui disable - disable FH3 for the current user";

var util = require('util');
var user = require('./user.js');
var common = require('../../common.js');
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require("../../utils/ini");


// Command for telling us if we're in NGUI or not
function ngui(argv, cb) {
  var args = argv._;

  if (args[0] === 'enable') return enableNewStudioForUser(cb);
  if (args[0] === 'disable') return disableNewStudioForUser(cb);
  //var target = fhc.curTarget;
  //fhc.config.set(target'-isFH3')

  user({ _ : []}, function(err, user) {
    if (err) return cb(err);
    if (!user) return cb('No user details, possibly not logged in?');
    if (!user.prefs) return cb('No user prefs! - ' + util.inspect(user));
    if (user.prefs['studio.version'] === 'beta') return cb(null, true);
    else return cb(null, false);
  });
}

function enableNewStudioForUser(cb) {
  var payload = {"payload":{"key":"studio.version","value":"beta"}};
  makeCall(payload, function(err, res){
    if (err){
      return cb(err);
    }
    ini.set('fhversion', 3);
    ini.save(function(){
      return cb(err, res);
    });
  });
}

function disableNewStudioForUser(cb) {
  var payload = {"payload":{"key":"studio.version","value":""}};

  makeCall(payload, function(err, res){
    if (err){
      return cb(err);
    }
    ini.set('fhversion', 2);
    ini.save(function(){
      return cb(err, res);
    });
  });
}

function makeCall(payload, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.curTarget + "/user/setProp", payload, "Error calling user props", function(err, data){
    if (err) return cb(err);
    return cb(null, data);
  });
}
