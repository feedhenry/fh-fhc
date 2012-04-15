"use strict";

var fhreq = require("./utils/request");

/*
* these arguments were grouped because they normally stay constant throught out a session,
* therefore the same object can be passed for each api call
* @options: { 
*       host: "https://apps.feedhenry.com",
*       domain: "apps",
*       cookie ""
*   }
* 
*
*/
// Common API call to FeedHenry
var api = module.exports = {

  doApiCall: function(options, type, name, params, errorMsg, cb) {
    fhreq.POST({
      host: options.host,
      cookie: options.cookie,
      uri: "box/srv/1.1/ide/" + options.domain + "/" + type + "/" + name,
      params: params
    }, function (error, data, raw, response) {
      if (error) {
        return cb(error, null);
      }
      if(data.msg && data.address && data.address["login-status"] == 'none') {
        return cb(new Error("Not authorised\n" + data.msg), null);
      }

      if(data.status && data.status !== 'ok') {
        var msg = data.message || data.msg;
        return cb(errorMsg + msg, data);
      }
      return cb(null, data);
    }); 
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
    var wantJson = ini.get('json');
    setTimeout(function() {
      //log.verbose("polling for cacheKey: " + cacheKey + " start: " + start + " to complete", "Polling");
      var params = [{
          cacheKey: cacheKey,
          start: start
      }];

      var uri = 'box/srv/1.1/dat/log/read?cacheKeys=' + encodeURIComponent(JSON.stringify(params));

      fhreq.GET({
          host: options.host,
          uri: uri,
          cookie: options.cookie
      }, function (error, data, raw, respose){

        if (error) return cb(error, null);
        if (data[0] && data[0].status != undefined && data[0].status == 'pending') {
          start++;
          if(!wantJson) {
            if(data[0].progress) {
              console.log("Progress: " + data[0].progress + "%");
            } else {
              process.stdout.write('.');
            }
          }
          return exports.waitForJob(cacheKey, start++, cb);
        }
        else {
          if(data[0] && data[0].status && data[0].status === 'error') {
            return cb(data, null);
          } else {
            return cb(null, data);      
          }
        }
      });
    }, 500);
  },

  // used in conjunction with async.map to wait for multiple jobs to finish
  waitFor: function(options, key, cb) {
    exports.waitForJob(options, key, 0, cb);
  }

};
