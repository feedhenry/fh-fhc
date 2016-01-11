
module.exports = logout;
logout.usage = "fhc logout";
logout.desc = "Logout from FeedHenry";

var fhc = require("../../fhc");
var ini = require("../../utils/ini");
var fhreq = require("../../utils/request");
var targets = require('../fhc/targets.js');
var keys = require('../common/keys/user.js');

// main logout entry point
function logout (argv, cb) {
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/act/sys/auth/logout", function (err, remoteData, raw, response) {
    var user = fhc.config.get('username');
    if(err) return cb(err);
    ini.del('cookie');
    ini.del('username');
    ini.del(keys.KEY_ID);
    ini.save(function(err){
      // remove from targets
      var targ = fhc.config.get("feedhenry");
      targets.removeTarget(targ, user);
      logout.message = "Successfully logged out of " + targ;
      return cb(err, remoteData);
    });
  });
}
