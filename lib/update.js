
module.exports = update;
update.update = update;

update.usage = "fhc update <app-id> <property-name> <property-value>";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require("./utils/exec.js");
var millicore = require("./utils/millicore.js");
var ini = require('./utils/ini');
var Table = require('cli-table');

// Main update entry point
function update (args, cb) {
  if (args.length !== 3) return cb(update.usage);

  var appId = fhc.appId(args[0]);
  var name = args[1];
  var value = args[2];
  return doUpdate(appId, name, value, cb);

};

// update app properties
// if the property name is one of our known app property names (e.g. title, description, etc) then 
// we update it specifically. If its not, we add the name/value to the config object.
// Note that git properties are updated through the git command.
function doUpdate(appId, name, value, cb) {
  name = name.toLowerCase();
  var knownProps = ['title', 'description', 'width', 'height'];
  if (knownProps.indexOf(name) != -1) {
    setKnownProperty(appId, name, value, cb);
  } else {
    setConfigProperty(appId, name, value, cb);
  }
};


// set a config object property
function setConfigProperty(appId, k, v, cb) {  
  fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/setconfig", {guid: appId, key: k, value: v},  function (er, remoteData, raw, response) {
    if (er) {
      log.error("Error reading app: " + er);
      cb(er);
    }else {
      if (remoteData.status != 'ok') {          
        return cb(remoteData.messsage, remoteData);
      }  
      update.message = "Config property set ok";
      return cb(undefined, remoteData);   
    }
  });  
};

// Set one of our known properties..
// Note: although we're just setting properties on the app object, the app update endpoint expects the full config object..
function setKnownProperty(appId, k, v, cb){
  common.readApp(appId, function(err, cfg){
    if (err) return cb(err);

    // the config object returned from readApp is not the expected format for app/update :-(
    var payload = {  "payload": {
        "app": cfg.app.guid,
        "inst": appId,
        "title": cfg.inst.title,
        "description": cfg.inst.description,
        "height": cfg.inst.height,
        "width": cfg.inst.width,
        "config": cfg.inst.config,
        "widgetConfig": cfg.app.config
      }, 
      "context": {}
    };
    
    // update the respective nv pair
    payload.payload[k] = v;

    fhreq.POST(fhreq.getFeedHenryUrl(), "box/srv/1.1/ide/" + fhc.domain + "/app/update", payload,  function (err, remoteData, raw, response) {
      if (err) {
        log.error("Error updating app: " + err);
        cb(err);
      }else {
        update.message = "Property set ok";
        if (remoteData.status != 'ok') {          
          update.message = "Error setting property: " + remoteData.message;
          return cb(remoteData.messsage, remoteData);
        }  
        return cb(undefined, remoteData);   
      }
    });
  });  
};

// bash completion
update.completion = function (opts, cb) {
  common.getAppIds(cb);  
};
