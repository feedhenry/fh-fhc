"use strict";

var api = require("./api");

// main user entry point
module.exports = {
  read: function(options, cb) {
    api.doUserCall(options, "read", null, "Error reading user", function (err, data, raw, response) {
      if (err) return cb(err, null);
      
      if (data.status === 'error' && data.msg && data.msg[0] && data.msg[0].indexOf('Operation not permitted') !== -1) {
        return cb(new Error("Operation not permitted"), null);
      } else {
        return cb(null, data);
      }
    });
  }
};
