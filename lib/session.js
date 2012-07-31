
module.exports = session;
session.verifySession = verifySession;
session.sessionInfo = sessionInfo;

session.usage = "\nfhc session info <session-token>"
               +"\nfhc session verify <session-token>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main session entry point
function session (args, cb) {
  if (args.length != 2){
    return cb("Invalid arguments:" + session.usage);
  }

  var action = args.shift();
  switch (action) {
    case "info" : return sessionInfo(args[0], cb);
    case "verify" : return verifySession(args[0], cb);
    default: return cb("Invalid arguments:" + session.usage);
  }
}

// verify session
function verifySession(sessionToken, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/verifysession", {sessionToken: sessionToken}, "Error in verify session call: ", function(err, session){
    if(err) return cb(err);
    return cb(undefined, session);
  });
}

// session info
function sessionInfo(sessionToken, cb) {  
  common.doApiCall(fhreq.getFeedHenryUrl(), "/box/srv/1.1/admin/authpolicy/sessioninfo", {sessionToken: sessionToken}, "Error in session info call: ", function(err, session){
    if(err) return cb(err);
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
/*
  var action = argv[2];
  switch (action) {
    case "update":
    case "read":
    case "delete":
      // get session list
      break;
    case "list":
      return cb(null, []);
    default: return cb(null, []);
  }
*/
};
