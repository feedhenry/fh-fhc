/* globals i18n */
module.exports = session;
session.verifySession = verifySession;
session.sessionInfo = sessionInfo;

session.desc = i18n._("Verify a FeedHenry Auth Policies Session");
session.usage = "\nfhc session info <session-token>"
  + "\nfhc session verify <session-token>";

var fhreq = require("../../utils/request");
var common = require("../../common");

// Main session entry point
function session(argv, cb) {
  var args = argv._;
  if (args.length !== 2) {
    return cb(i18n._("Invalid arguments:") + session.usage);
  }

  var action = args.shift();
  switch (action) {
    case "info" :
      return sessionInfo(args[0], cb);
    case "verify" :
      return verifySession(args[0], cb);
    default:
      return cb(i18n._("Invalid arguments:") + session.usage);
  }
}

// verify session
function verifySession(sessionToken, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/verifysession", {sessionToken: sessionToken}, i18n._("Error in verify session call: "), function (err, session) {
    if (err) return cb(err);
    return cb(undefined, session);
  });
}

// session info
function sessionInfo(sessionToken, cb) {
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/sessioninfo", {sessionToken: sessionToken}, i18n._("Error in session info call: "), function (err, session) {
    if (err) return cb(err);
    return cb(undefined, session);
  });
}

// bash completion
session.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "session") argv.unshift("session");

  if (argv.length === 2) {
    var cmds = ["info", "verify"];
    return cb(undefined, cmds);
  }
};
