
module.exports = login;

var ini = require("../../utils/ini");
var log = require("../../utils/log");
var util = require('util');
var fhlogin = require("../../utils/fhlogin.js");
var fhc = require("../../fhc");
var prompt = require("../../utils/prompt");
var promiseChain = require("../../utils/promise-chain");
var crypto;
var output = require("../../utils/output");
var targets = require("./targets.js");
var fhreq = require("../../utils/request");
var ngui = require("../common/ngui");

try {
  crypto = process.binding("crypto") && require("crypto");
} catch (ex) {}

login.usage = "fhc login <username> <password>\nYou are prompted for username/password if none are provided.";
login.desc = "Login to FeedHenry";

// main login entry point
function login (argv, cb) {
  var args = argv._;
  if (!crypto) return cb(new Error("You must compile node with ssl support to use login"));

  var u = { u : fhc.config.get("username")
          , p : null
          }
    , changed = false;

  if (args.length === 0) {
    promiseChain(cb)
      (prompt, ["Username: ", u.u], function (un) {
        changed = u.u !== un;
        u.u = un;
      })
      (function (cb) {
        if (u.p && !changed) return cb(undefined, u.p);
        prompt("Password: ", u.p, true, cb);
      }, [], function (pw) { u.p = pw; })

      (function (cb) {
        fhlogin(u.u, u.p, function (err, json) {
          processLogin(u.u, u.p, err, json, cb);
        });
      })
      ();
  } else if (args.length === 1){
    promiseChain(cb)

    (function (cb) {
      if (u.p && !changed) return cb(undefined, u.p);
      prompt("Password: ", u.p, true, cb);
    }, [], function (pw) { u.p = pw; })

    (function (cb) {
      fhlogin(args[0], u.p, function (err, json) {
        processLogin(args[0], u.p, err, json, cb);
      });
    })
    ();
  } else if (args.length < 2) {
    return cb("Please specify username and password.");
  } else {
    var domain = args[2];
    fhlogin(args[0], args[1], domain, function (err, json) {
      processLogin(args[0], args[1], err, json, cb);
    });
  }
};

// Process our login result, save target, etc
function processLogin(user, pwd, err, json, cb){
  if (err) return cb(err);
  var js = JSON.parse(json);
  if (js.result != 'ok') {
    login.message = "Login failed: " + js.reason;
    return cb("login failed: " + js.reason, js);
  } else {
    ini.set("username", user, "user");
    ini.set("cookie", js.login, "user");
    ini.set("domain", js.domain, "user");
    // Default version to 3 - it'll be reset in the subsequent command
    ini.set("fhversion", 3, "user");
    ngui({_ : []}, function(err, isFh3){
      if (err){
        return cb(err);
      }
      var version = (isFh3) ? 3 : 2;
      ini.set("fhversion", version, "user"); // TODO: This maybe needs to be un-set at some point, when switching targets?
      log("Authorized user " + user, "login");

      targets.save(user, js.login, js.domain, version);
      ini.save(function(err){
        login.message = "Successfully logged into " + fhreq.getFeedHenryUrl();
        return cb(err, js);
      });
    });

  }
}
