/* globals i18n */
module.exports = login;

var fhreq = require("./request");
var log = require("./log");
var fhc = require("../fhc");
var util = require('util');
var crypto;

try {
  crypto = process.binding("crypto") && require("crypto");
} catch (ex) {
  // ignore error
}

function login(username, password, domain, cb) {
  if (!crypto) {
    return cb(new Error(i18n._("You must compile node with ssl support to use the login feature")));
  }

  var data = {};
  data.u = username;
  data.p = password;

  if ('function' !== typeof domain) {
    data.d = domain;
  } else {
    cb = domain;
  }

  log.silly(data, "login POST data");
  fhreq.POST (fhreq.getFeedHenryUrl(), '/box/srv/1.1/act/sys/auth/login', data, function (error, data, json, response) {
    if (!error) {
      if (response && response.statusCode !== 200) {
        var msg = json || response.body || " ";
        return cb(i18n._("Login error, problem contacting: ") + fhreq.getFeedHenryUrl() + " " + msg);
      }

      fhc.config.set("username", username);
      var js;
      try {
        js = JSON.parse(json);
      } catch (x) {
        return cb(i18n._("Error parsing response: ") + json + " - " + util.inspect(x));
      }

      if (js.login !== undefined) {
        log.silly(js.login, "Setting cookie");
        fhc.config.set("cookie", js.login);
      }
    }
    cb = done(cb);
    if (!error || !response || response.statusCode !== 409) {
      return cb(error, data, json, response);
    }
  });
}

function done(cb) {
  return function (error, data, json, response) {
    if (!error && (!response || response.statusCode === 200)) {
      return cb(error, json, response);
    }
    log.silly(response, "login response");
    log.error(JSON.stringify(data), "login");
    return cb(new Error((response && response.statusCode) + " " +
                        i18n._("Could not login! ") + '\n' + JSON.stringify(data)));
  };
}
