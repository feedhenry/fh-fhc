"use strict";

var fhreq = require("./utils/request");

/*
* these arguments were grouped because they normally stay constant throught out a session,
* therefore the same object can be passed for each api call
* @options: { 
*       host: "https://apps.feedhenry.com",
*       domain: "apps",
*       login ""
*   }
* 
*
*/
// Common API call to FeedHenry
var api = module.exports = {

  BASE_ENDPOINT: "box/srv/1.1/",

  doRemoteCall: function(options, endpoint, params, errorMsg, cb) {
    fhreq.POST({
      host: options.host,
      uri: api.BASE_ENDPOINT + endpoint,
      login: options.login,
      params: params
    }, function (err, data, raw, response) {
      if (err) {
        return cb(err, data, raw, response);
      }
      if(data.msg && data.address && data.address["login-status"] == 'none') {
        return cb(new Error("Not authorised\n" + data.msg), data, raw, response);
      }
      if(data.status && data.status !== 'ok') {
        var msg = data.message || data.msg;
        return cb(new Error(errorMsg + msg), data, raw, response);
      }
      return cb(null, data, raw, response);
    });
  },

  doApiCall: function(options, type, name, params, errorMsg, cb) {
    var endpoint = "ide/" + options.domain + "/" + type + "/" + name;

    api.doRemoteCall(options, endpoint, params, errorMsg, cb);
  },

  doUserCall: function(options, name, params, error, cb) {
    api.doApiCall(options, "user", name, params, error, cb);
  },

  doFileCall: function(options, name, params, error, cb) {
    api.doApiCall(options, "file", name, params, error, cb);
  },

  doAppCall: function(options, name, params, error, cb) {
    api.doApiCall(options, "app", name, params, error, cb);
  },

  doConfigCall: function(options, name, params, error, cb) {
    api.doApiCall(options, "config", name, params, error, cb);
  },

  // Poll remote job until its finished
  waitForJob: function(options, cacheKey, start, cb) {
    setTimeout(function() {
      console.log(cb);
      var params = [{
          cacheKey: cacheKey,
          start: start
      }];

      var uri = api.BASE_ENDPOINT + 'dat/log/read?cacheKeys=' + encodeURIComponent(JSON.stringify(params));

      fhreq.GET({
          host: options.host,
          uri: uri,
          login: options.login
      }, function (error, data, raw, response) {

        if (error) return cb(error, null);
        if (data[0] && data[0].status && data[0].status === 'pending') {
          start++;
          return api.waitForJob(options, cacheKey, start++, cb);
        }
        else {
          if(data[0] && data[0].status && data[0].status === 'error') {
            return cb(data, null);
          } else {
            return cb(null, data, raw, response);
          }
        }
      });
    }, 500);
  },

  // used in conjunction with async.map to wait for multiple jobs to finish
  waitFor: function(options, key, cb) {
    console.log(cb);
    api.waitForJob(options, key, 0, cb);
  }

};
