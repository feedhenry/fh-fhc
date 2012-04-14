"use strict";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");

function doMsgCall(options, uri, cb) {
  fhreq.GET({
    host: options.host,
    cookie: options.cookie,
    uri: uri
  }, function (err, data, raw, response) {
    return cb(err, remoteData);
  });
}

module.exports = {

  pingVersion: function(pingVersion, cb) {  
    doMsgCall(options, "sys/info/" + pingVersion, cb);
  },

  topics: function(options, cb) {  
    doMsgCall(options, "msg" + pingVersion, cb);
  },

  topic: function(options, topic, cb) {  
    doMsgCall(options, "msg/" + topic, cb);
  },

  query_topic: function(topic, query, cb) {
    doMsgCall(options, "msg/" + topic + "?" + query, cb);
  },

  message: function(topic, id, cb) {  
    doMsgCall(options, "msg/" + topic + "/" + id, cb)
  }
};
