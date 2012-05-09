"use strict";

//var log = require("./utils/log");
var api = require("./api");
var apps = require("./apps");
var request = require('request');
var fs = require('fs');
var https = require('https');


module.exports = {

  // get our log files
  list: function(options, appId, target, cb) {
    var payload = {
      payload: {
        guid: appId,
        deploytarget: target,
        action: 'list'
      }
    };
    //log.verbose(payload, 'Listing logs');

    api.doAppCall(options, "logs", payload, "Error getting logs: ", cb);
  },
  
  //read a log file
  read: function (options, appId, logName, target, cb) {
    var payload = {
      payload: {
        guid: appId,
        deploytarget: target,
        logname: logName,
        action: 'get'
      }
    };

    //log.verbose(payload, 'Getting logs');
    api.doAppCall(options, "logs", payload, "", cb);
  },

  // delete log file
  remove: function(options, appId, logName, target, cb) {
    var payload = {
      payload: {
        guid: appId,
        deploytarget: target,
        action: 'delete',
        logname: logName
      }
    };
    //log.verbose(payload, 'Deleting log');

    api.doAppCall(options, "logs", payload, "Error deleting log: ", cb);
  },

  // Stream log file
  // Note this purposely doesn't return json or set the .message property (unlike practically all other calls)
  // Instead this streams the requested log file straight to another stream (file currently)
  stream: function(options, appId, logName, outputFile, cb) {

    if(!logName) return cb(new Error("Unspecified Log File"), null);

    // first get app hosts
    apps.hosts(options, appId, function(error, data) {
      if(error) return cb(error, null);
      if(!appName) return cb(new Error(appId + " not found"), null);
    
      // TODO - check if no appName/appUrl found - errors not streaming properly from Request
      var appName = data['live-name'],
          appUrl = data['live-url'];
     
      var url = appUrl.replace(appName, 'api'),
          fullUrl = url + "/streamlog/" + appName + "/" + logName,
          hosturl = url.replace("https://","");

      var logrequest  = {
        host : hosturl,
        path : "/streamlog/" + appName + "/" + logName,
        method : 'GET',
        port : 443
      };
        
      var sstream = (outputFile) ? fs.createWriteStream(outputFile) : undefined;

      var req = https.request(logrequest, function(res) {
        res.setEncoding('utf8');
        if(res.statusCode === 404){
          return cb(new Error("Log file not found"), null);
        }

        res.on('data',function (chunk) {
          if(sstream === undefined) {
            process.stdout.write(chunk);
          } else {
            sstream.write(chunk);
          }
        });

        res.on('end',function (){
            if(sstream) {
              sstream.end();
              return cb(null, "log written "+outputFile);
            } else {
              return cb(null, "-- END --");
            }
        });
      });

      req.on('error',function(err){
         return cb(err, null);
      });

      req.end();
    });
  }
};