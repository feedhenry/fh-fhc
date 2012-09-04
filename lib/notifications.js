module.exports = notifications;
notifications.usage = "fhc notifications <app-id> <email-address-to-notify>";

var fhc = require("./fhc");
var common = require("./common");
var update = require("./update");

// Main update entry point
function notifications (args, cb) {
  if (args.length !== 2) return cb(notifications.usage);

  var appId = fhc.appId(args[0]);
  var name = 'notification_email';
  var value = args[1];
  return update.doUpdate(appId, name, value, cb);
};

// bash completion
notifications.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
