
module.exports = logout;
logout.usage = "fhc logout";

var fhc = require("./fhc");
var util = require('util');
var ini = require("./utils/ini");
var output = require("./utils/output");
var fhreq = require("./utils/request");
var targets = require('./targets.js');

// main logout entry point
function logout (args, cb) {  
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/act/sys/auth/logout", function (err, remoteData, raw, response) {
    var user = fhc.config.get('username');
    if(err) return cb(err);
    ini.del('cookie');
    ini.del('username');
    ini.del('_password');
    ini.save(function(err){
      // remove from targets
      var targ = fhc.config.get("feedhenry");
      targets.removeTarget(targ, user);
      logout.message = "Successfully logged out of " + targ;
      return cb(err, remoteData);
    });
  });
}
