"use strict";

var fhreq = require("./utils/request");

// Get FeedHenry platform version
module.exports = function(options, cb) {
  fhreq.GET({
  	host: options.host,
  	uri: "box/srv/1.1/tst/version",
  	cookie: options.cookie
  }, function (err, data, raw, response) {
    if (err) return cb(err, null);

    if (response.statusCode === 200) {
      data.status = "ok";
      data.statusCode = 200;
      version.message = "FeedHenry " + data.Environment + " " + data.Release + " " + data["Revision Date"];
      return cb(err, data);  
    }
    return cb({status: 'error', error: data, statusCode: response.statusCode}, null);
  });
};
