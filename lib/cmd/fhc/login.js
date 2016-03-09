module.exports = login;

var ini = require("../../utils/ini");
var log = require("../../utils/log");
var fhlogin = require("../../utils/fhlogin.js");
var fhc = require("../../fhc");
var prompt = require("../../utils/prompt");
var promiseChain = require("../../utils/promise-chain");
var crypto;
var targets = require("./targets.js");
var fhreq = require("../../utils/request");
var ngui = require("../common/ngui");
var request = require('request').defaults({'proxy': fhc.config.get("proxy")});
var _ = require('underscore');

try {
  crypto = process.binding("crypto") && require("crypto");
} catch (ex) {
  // ignore error
}

login.usage = "fhc login <username> <password>\nYou are prompted for username/password if none are provided.";
login.desc = "Login to FeedHenry";

// main login entry point
function login(argv, cb) {
  var args = argv._;
  if (!crypto) {
    return cb(new Error("You must compile node with ssl support to use login"));
  }

  var u = {
      u: fhc.config.get("username"),
      p: null
    },
    changed = false;
  if (args.length === 0) {
    promiseChain(cb)(prompt, ["Username: ", u.u], function(un) {
      changed = u.u !== un;
      u.u = un;
    })(function(cb) {
      if (u.p && !changed) {
        return cb(undefined, u.p);
      }
      prompt("Password: ", u.p, true, cb);
    }, [], function(pw) {
      u.p = pw;
    })(function(cb) {
      fhlogin(u.u, u.p, function(err, json) {
        processLogin(u.u, u.p, err, json, cb);
      });
    })();
  } else if (args.length === 1) {
    promiseChain(cb)(function(cb) {
      if (u.p && !changed) {
        return cb(undefined, u.p);
      }
      prompt("Password: ", u.p, true, cb);
    }, [], function(pw) {
      u.p = pw;
    })(function(cb) {
      fhlogin(args[0], u.p, function(err, json) {
        processLogin(args[0], u.p, err, json, cb);
      });
    })();
  } else if (args.length < 2) {
    return cb("Please specify username and password.");
  } else {
    var domain = args[2];
    fhlogin(args[0], args[1], domain, function(err, json) {
      processLogin(args[0], args[1], err, json, cb);
    });
  }
}

function parseFHCookie(jar) {
  var cookie = _.findWhere(jar.cookies, {
    name: 'feedhenry'
  });
  return cookie.value;
}

function signOver(signoverUrl, cb) {
  // Signover to get a session
  var jar = request.jar();
  request(signoverUrl, {
    jar: jar
  }, function(err) {
    if (err) {
      return cb(err);
    }

    var cookieValue = parseFHCookie(jar);
    if (!cookieValue) {
      return cb("Failed to fetch FeedHenry cookie.");
    }
    return cb(null, cookieValue);
  });
}

// Process our login result, save target, etc
function processLogin(user, pwd, err, json, cb) {
  if (err) {
    return cb(err);
  }
  var js = JSON.parse(json);

  if (js.domains && js.domains.length === 1) {
    // Single domain, signover and cookie the user, set the correct target

    var firstDomain = js.domains[0];

    var signoverUrl = firstDomain.signoverUrl;
    var domain = js.domains[0].domain;
    var host = firstDomain.host;

    log('Redirecting to ' + host);

    signOver(signoverUrl, function(err, cookie) {
      if (err) return cb(err);

      saveLogin(user, cookie, domain, host, function(err) {
        cb(err, js);
      });
    });
  } else if (js.domains && js.domains.length === 0) {
    cb("Please sign into the App Studio via your Browser to create a Domain. You will then be able to target and login to this domain.");
  } else if (js.domains && js.domains.length > 1) {
    cb("Multiple domains not supported for signover yet - please target the specific domain you want to login to");
  } else {
    if (js.result !== 'ok') {
      login.message = "Login failed: " + js.reason;
      return cb("login failed: " + js.reason, js);
    } else {
      saveLogin(user, js.login, js.domain, null, function(err) {
        cb(err, js);
      });
    }
  }
}

function saveLogin(username, cookie, domain, targetUrl, cb) {
  ini.set("username", username, "user");
  ini.set("cookie", cookie, "user");
  ini.set("domain", domain, "user");

  if (targetUrl) {
    ini.set("feedhenry", targetUrl, "feedhenry");
  }

  // Default version to 3 - it'll be reset in the subsequent command
  ini.set("fhversion", 3, "user");
  ngui({
    _: []
  }, function(err, isFh3) {
    if (err) {
      return cb(err);
    }
    var version = (isFh3) ? 3 : 2;
    // TODO: This maybe needs to be un-set at some point, when switching targets?
    ini.set("fhversion", version, "user");
    log("Authorized user " + username, "login");

    targets.save(username, cookie, domain, version, targetUrl);
    ini.save(function(err) {
      login.message = "Successfully logged into " + fhreq.getFeedHenryUrl();
      return cb(err);
    });
  });
}