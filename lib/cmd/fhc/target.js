// target millicore
/* globals i18n */
module.exports = target;
target.desc = i18n._("Get/Set the FeedHenry FHC Target URL");
target.usage = "fhc target"
  +"\nfhc target <feedhenry-url>"
  +"\nfhc target <feedhenry-url> <user>"
  +"\nfhc target <feedhenry-url> <user> <password>";

var fhc = require("../../fhc");
var ini = require("../../utils/ini");
var login = require("./login.js");
var targets = require("./targets.js");
var log = require("../../utils/log");
var fhreq = require("../../utils/request");
var keys = require('../../utils/userkeys');
var async = require('async');
var util = require('util');

// Main target entry point
function target(argv, cb) {
  var args = argv._;
  var targ = fhc.config.get("feedhenry");
  if (args.length === 0) {
    if (!targ) {
      return cb(undefined, i18n._("You have not targetted a domain - please target one via `fhc target <hostname>`"));
    }
    return cb(undefined, targ);
  }

  if (args.length !== 1 && args.length > 4) {
    return cb(target.usage);
  }
  var tar = args[0];

  // Check if target begins with http/https
  if (tar.indexOf('http://') !== 0 && tar.indexOf('https://') !== 0) {
    log.info(i18n._("No http/https given, assuming https://"));
    tar = "https://" + tar;
  }

  async.series([
    function(cb) {
      // Valiate FeedHenry target can be pinged..
      pingTarget(tar, function(err, data) {
        if (err) {
          return cb(err);
        }
        if (data.statusCode !== 200) {
          return cb(i18n._("Invalid target: ") + tar + JSON.stringify(data));
        }

        return cb();
      });
    }
  ], function(err) {
    if (err) {
      return cb(err);
    }
    // TODO - suboptimal this now that we have 'targets', ini file being saved twice.. REFACTOR
    log.silly(tar, "Setting new feedhenry url");
    var where = ini.get("global") ? "global" : "user";
    ini.set('feedhenry', tar, where);
    ini.save(function(err) {
      if (err) {
        return cb(err);
      }

      if (args.length === 3) {
        return login({ _ : [args[1], args[2]] }, cb);
      }
      // attempt to set existing target cookie..
      var t = { target: tar };
      if (args[1]) {
        t.user = args[1];
      }

      log.silly(t, "Getting Target");
      var targ = targets.getTarget(t);
      log.silly(targ, "Got Target");

      if (typeof targ === 'undefined') {
        return undefinedTargCleanup(cb, tar);
      }

      // set username and cookie
      if (targ.user) {
        ini.set("username", targ.user, "user");
      }
      if (targ.cookie) {
        ini.set("cookie", targ.cookie, "user");
      }
      if (targ.domain) {
        ini.set("domain", targ.domain, "user");
      }
      if (targ[keys.KEY_ID]) {
        ini.set(keys.KEY_ID, targ[keys.KEY_ID], "user");
      }
      ini.save(function(err) {
        var message;
        if (targ.user) {
          message = " User: " + targ.user;
        } else {
          message = " API Key: " + targ[keys.KEY_ID];
        }
        target.message = i18n._("Successfully targeted: ") + targ.target + message;
        return cb(err, targ);
      });
    });
  });
}

function undefinedTargCleanup(cb, tar) {
  ini.del("cookie");
  keys.delUserApiKey();
  ini.save(function(err) {
    target.message = util.format(i18n._("Successfully targeted %s"), tar);
    target.message += i18n._(" - now, log in.\n");
    target.message += login.usage;
    return cb(err, tar);
  });
}

function pingTarget(targ, callback) {
  fhreq.GET(targ, "/box/srv/1.1/tst/version", i18n._("error pinging target"), function(err, parsed, _, response) {
    if (err) {
      return callback(err);
    }

    return callback(err, {statusCode: response.statusCode, data: parsed});
  });
}