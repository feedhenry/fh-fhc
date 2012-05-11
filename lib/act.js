"use strict";

var fhreq = require("./utils/request");
var api = require("./api.js");
var request = require('request');
var apps = require("./apps");

module.exports = {

  // TODO - full development proxy (no proxy through millicore)
  doMillicoreAct: function(options, appId, funct, data, cb) {
    fhreq.POST({
        host: options.host,
        uri: api.BASE_ENDPOINT + "act/" + options.domain + "/" + appId + "/" + funct + "/" + appId,
        params: data
    }, function (err, data, raw, response) {
      if (err) {
        return cb(err, null);
      }
      return cb(err, data);
    });
  },

  // Do our live action
  // TODO - cache the endpoint lookup (so we don't have to call every time)
  doLiveAct: function(options, appId, funct, data, cb) {
    apps.hosts(options, appId, function(err, data) {
      if(err) {
        return cb(err, null);
      }

      var appName = data['live-name'],
          appUrl = data['live-url'];

      // post to /cloud
      request({uri: appUrl + "/cloud/" + funct, method: 'POST', json: data}, function (err, response, body) {
        return cb(err, body);
      });
    });
  }
};

