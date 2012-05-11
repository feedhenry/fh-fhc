"use strict";

var fhreq = require("./utils/request");
var api = require("./api");

module.exports = {

  login: function(options, username, password, cb) {
  	
    var data = {
      u: username,
      p: password,
      d: options.domain
    };

    api.doAuthCall(options, "login", data, function (error, data, raw, response) {

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
        cb(new Error((response && response.statusCode) + " Could not login!"), data, raw, response);
      }
    });
  },

  logout: function(options, cb) {
    api.doAuthCall(options, "logout", null, function (error, data, raw, response) {
      if(!error && response && response.statusCode === 200) {
        cb(null, data, raw, response);
      }
      else if(error) {
        cb(error, null, raw, response);
      }
      else {
        cb(new Error("Could not log out of server\n" + raw), data, raw, response);
      }
    });
  }

};
