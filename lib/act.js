"use strict";

var fhreq = require("./utils/request");
var common = require("./common.js");
var request = require('request');
var apps = require("./apps");
var log = require("./util/log");


module.exports = {

  // TODO - full development proxy (no proxy through millicore)
  doMillicoreAct: function(options, appId, funct, data, cb) {  
    apps.read(options, appId, function (error, data) {
      if(err) return cb(err, null);

      widgId = data[];

      log.silly(widgId, "widgId");

      fhreq.POST({
          host: options.host,
          uri: "box/srv/1.1/act/" + fhc.domain + "/" + widgId + "/" + funct + "/" + appId,
          params: data
      }, function (error, data, raw, response) {
        if (error) {
          //log.verbose("Error in act: " + err);
          //log.verbose(remoteData, "list");
          return cb(error, null);
        }
        return cb(error, remoteData);        
      });
    });
  },

  // Do our live action
  // TODO - cache the endpoint lookup (so we don't have to call every time)
  doLiveAct: function(options, appId, funct, data, cb) {  
    apps.hosts(options, appId, function(error, data) {
      if(err) return cb(err, null);

      var appName = data['live-name'],
          appUrl = data['live-url'];

      // post to /cloud
      request({uri: appUrl + "/cloud/" + funct, method: 'POST', json: data}, function (err, response, body) {
        log.silly(response, "act response");
        return cb(error, body);
      });
    });
  }
};

