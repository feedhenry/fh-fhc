"use strict";

var fhreq = require("./utils/request");

function doMsgCall(options, uri, cb) {
  fhreq.GET({
    host: options.host,
    login: options.login,
    uri: uri
  }, function (err, data, raw, response) {
    return cb(err, data, raw, response);
  });
}

module.exports = {

  pingVersion: function(options, pingVersion, cb) {
    doMsgCall(options, "sys/info/" + pingVersion, cb);
  },

  topics: function(options, pingVersion, cb) {
    doMsgCall(options, "msg" + pingVersion, cb);
  },

  topic: function(options, topic, cb) {
    doMsgCall(options, "msg/" + topic, cb);
  },

  query_topic: function(options, topic, query, cb) {
    doMsgCall(options, "msg/" + topic + "?" + query, cb);
  },

  message: function(options, topic, id, cb) {
    doMsgCall(options, "msg/" + topic + "/" + id, cb);
  }
};
