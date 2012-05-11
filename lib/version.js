"use strict";

var fhreq = require("./utils/request");
var api = require("./api");

// Get FeedHenry platform version
module.exports = function(options, cb) {
  fhreq.GET({
    host: options.host,
    uri: api.BASE_ENDPOINT + "tst/version",
    login: options.login
  }, function (err, data, raw, response) {
    if (err) return cb(err, data, raw, response);

    if (response.statusCode === 200) {
      data.status = "ok";
      data.statusCode = 200;
      return cb(null, data, raw, response);
    }
    return cb(new Error(data), data, raw, response);
  });
};
