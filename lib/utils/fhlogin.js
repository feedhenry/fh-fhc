module.exports = login;

var fhreq = require("./request");
var log = require("./log");
var fhc = require("../fhc");
var util = require('util');
var crypto;

try {
  crypto = process.binding("crypto") && require("crypto");
} catch (ex) {}

function sha (s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function login (username, password, cb) {
  if (!crypto) return cb(new Error("You must compile node with ssl support to use the login feature"));
      
  var data = {};
  data.u = username;
  data.p = password;
  cb = done(cb);
  log.verbose(data, "before first POST");
  fhreq.POST
    ( fhreq.getFeedHenryUrl(), '/box/srv/1.1/act/sys/auth/login'
    , data
    , function (error, data, json, response) {
        if (!error) {         
          fhc.config.set("username", username);
          fhc.config.set("_password", password);       
          var js = JSON.parse(json);
          if (js.login != undefined){            
            log.verbose(js.login, "Setting cookie");
            fhc.config.set("cookie", js.login);
          }            
        }
        if (!error || !response || response.statusCode !== 409) {
          return cb(error, data, json, response);
        }
    });
};

function done (cb) { 
  return function (error, data, json, response) {
    if (!error && (!response || response.statusCode === 200)) {
      return cb(error, json);
    }
    log.verbose(response, "login response");
    log.error(JSON.stringify(data), "login");
    return cb(new Error( (response && response.statusCode) + " "+
      "Could not login! " + '\n'+JSON.stringify(data)));
  };
};
