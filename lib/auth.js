"use strict";

var fhreq = require("./utils/request");
var api = require("./api");
var crypto;

try {
  crypto = process.binding("crypto") && require("crypto");
} catch (ex) {}


function doAuthCall(options, name, params, cb) {
  fhreq.POST({
    host: options.host,
    domain: options.domain,
    uri: api.ENDPOINT + 'act/sys/auth/' + name,
    params: params
  }, cb);
}


module.exports = {

  login: function(options, username, password, cb) {
    if (!crypto) return cb(new Error("You must compile node with ssl support to use the login feature"), null);

    var data = {
      u: username,
      p: password,
      d: options.domain
    };

    doAuthCall(options, "login", data, function (error, data, raw, response) {

      if(!error && response && response.statusCode === 200 && data) {
        if(data.result === "fail") {
          cb(new Error("Invalid login details"), data, raw, response);
        }
        else {
          //successful login
          cb(null, data, raw, response);
        }
      }
      else if(error) {
        cb(error, data, raw, response);
      }
      else {
        cb(new Error((response && response.statusCode) + " "+
          "Could not login! " + '\n'+JSON.stringify(json)), data, raw, response);
      }
    });
  },

  logout: function(options, cb) {
    doAuthCall(options, "logout", null, function (error, data, raw, response) {
      if(!error && response && response.statusCode === 200) {
        cb(null, data, raw, response);
      }
      else if(error) {
        cb(error, null, raw, response);
      }
      else {
        cb(new Error("Could not log out of server\n" + json), data, raw, response);
      }
    });
  }

}
