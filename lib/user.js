"use strict";

var api = require("./api");

module.exports = {
  read: function(options, cb) {
    api.doUserCall(options, "read", null, "Error reading user", function (err, data, raw, response) {
      if (err) return cb(err, null);
      
      if (data.status === 'error' && data.msg && data.msg[0] && data.msg[0].indexOf('Operation not permitted') !== -1) {
        return cb(new Error("Operation not permitted"), data, raw, response);
      } else {
        return cb(null, data, raw, response);
      }
    });
  }
};
