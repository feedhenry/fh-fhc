module.exports = ngui;
ngui.usage = "fhc ngui";

var user = require('./user.js');

// Command for telling us if we're in NGUI or not
function ngui(args, cb) {
  user([], function(err, user) {
    if (err) return cb(err);
    if (user.prefs['studio.version']) return cb(null, true);
    else return cb(null, false);
  });
};
