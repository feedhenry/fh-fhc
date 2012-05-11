"use strict";

var api = require("./api");

var git = module.exports = {
  pull: function(options, appId, cb) {
    var payload = {
      payload: {
        guid: appId
      }
    };

    api.doRemoteCall(options,
      "pub/app/" + appId + "/refresh", payload, "Error in Git pull: ", function(err, data, raw, response){
      if(err) return cb(err, data, raw, response);

      if(data.status !== 'ok') {
        return cb(new Error("Error in Git pull: " + data.error), data, raw, response);
      }

      if(data.cacheKey) {
        return api.waitFor(options, data.cacheKey, cb);
      }
      return cb(err, data, raw, response);
    });

  }
};