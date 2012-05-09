"use strict";

var api = require("./api");
var util = require('util');
var async = require('async');
var path = require('path');
var fs = require('fs');
var url = require('url');
var https = require('https');

var apps = module.exports = {

  list: function(options, cb) {
    api.doAppCall(options, "list", null, "Error reading app: ", cb);
  },


  listTemplates: function(options, cb) {
    api.doAppCall(options, "listTemplates", null, "Error reading template: ", cb);
  },

  create: function(options, appTitle, repo, branch, cb) {
    //TODO: do check on this
    var nodejsEnabled = false;
    var payload =  {
        title: appTitle,
        height: 300,
        width: 200,
        description: appTitle,
        config: {
          'nodejs.enabled' : nodejsEnabled
        }
    };

    if (repo) {
      payload.scmurl = repo;
    }

    if (branch) {
      payload.scmbranch = branch;
    }

    api.doAppCall(options, "create", payload, "Error creating new app: ", function(err, data, raw, response) {
      if(err) return cb(err, data, raw, response);

      if(data.tasks && data.tasks[0]) {
        async.map([data.tasks[0]], api.waitFor, function(err, results) {
          if(err) return cb(err, null);
          // note we return the original 'data' here (not the output from the cache polling)
          return cb(null, data, raw, response);
        });
      }else {
        // TODO: horrible hack, Millicore does not wait for git repos to be staged currently
        // (it returns immediatly), so for now (until issue 5248 is fixed) we wait a few seconds here before returning)
        if(repo) {
          setTimeout(function(){ return cb(err, data, raw, response);}, 3000);
        }else {
          return cb(err, data, raw, response);
        }
      }
    });
  },

  stage: function(options, app, target, clean, numappinstances, cb) {
    var type = target.toUpperCase() === "LIVE" ? 'releasestage' : 'stage';
    
    var payload = {
      payload: {
        guid: app,
        clean: clean
      }
    };
    if(numappinstances) {
      payload.payload.numappinstances = numappinstances;
    }

    // finally do our call
    api.doAppCall(options, type, payload, "Error staging app: ", function(err, data, raw, response) {
      if (err) return cb(err, data, raw, response);

      async.map([data.cacheKey], api.waitFor, function(err, results) {
        if(err) return cb(err, results);
                
        // Set the 'instances' value if set
        if(numappinstances) {
          apps.update(app, "nodejs.numappinstances", numappinstances, function(err, data){
            return cb(err, data);
          });
        } else {
          return cb(err, results);
        }
      });
    });
  },


  read: function(options, appId, cb) {
    var payload = {
      payload: {
        guid: appId
      }
    };

    api.doAppCall(options, "read", payload, "Error reading app: ", cb);
  },

  // update app properties
  // if the property name is one of our known app property names (e.g. title, description, etc) then
  // we update it specifically. If its not, we add the name/value to the config object.
  // Note that git properties are updated through the git command.
  update: function(options, appId, name, value, cb) {
    name = name.toLowerCase();
    var knownProps = ['title', 'description', 'width', 'height'];
    if (knownProps.indexOf(name) != -1) {
      apps.setKnownProperty(options, appId, name, value, cb);
    } else {
      apps.setConfigProperty(options, appId, name, value, cb);
    }
  },


  remove: function(options, appId, cb) {
    var payload = {
      payload: {
        confirmed: "true",
        guid: appId
      },
      context:{}
    };

    api.doAppCall(options, "delete", payload, "Error deleting app: ", cb);
  },

  search: function(options, query, cb) {
    var payload = {
      payload: {
        search: query
      },
      context: {}
    };
    api.doAppCall(options, "search", payload, "Error searching for app: ", cb);
  },

  hosts: function(options, appId, cb) {
    var payload = {
      payload: {
        guid: appId
      }
    };

    api.doAppCall(options, "hosts", payload, "Error getting hosts: ", cb);
  },

  ping: function(options, appId, deployTarget, cb) {
    var payload = {
      guid: appId,
      deploytarget:  deployTarget || 'dev'
    };

    api.doAppCall(options, "ping", payload, "Error pinging app: ", cb);
  },

  // read app statistics
  stats: function(options, appId, statsType, numResults, target, cb) {
    var payload = {
      payload:{
        guid: appId,
        deploytarget: target,
        statstype: statsType,
        count: numResults
      }
    };

    api.doAppCall(options, "stats", payload, "Error reading app statistics: ", cb);
  },

  setConfigProperty: function(options, appId, key, value, cb) {
    var payload = {
      guid: appId,
      key: key,
      value: value
    };

    api.doAppCall(options, "setconfig", payload, "Error seting config property: ", cb);
  },

  // Set one of our known properties..
  // Note: although we're just setting properties on the app object, the app update endpoint expects the full config object..
  setKnownProperty: function(options, appId, key, value, cb){
    apps.read(options, appId, function(err, data, raw, response){
      if (err) {
        return cb(err, data, raw, response);
      }

      // the config object returned from readApp is not the expected format for app/update :-(
      var payload = {
        "payload": {
            "app": data.app.guid,
            "inst": appId,
            "title": data.inst.title,
            "description": data.inst.description,
            "height": data.inst.height,
            "width": data.inst.width,
            "config": data.inst.config,
            "widgetConfig": data.app.config
          },
          "context": {}
      };
      
      // update the respective nv pair
      payload.payload[key] = value;

      api.doAppCall(options, "update", payload, function (error, data, raw, response) {
        if (error) {
          cb(err, data, raw, response);
        }
        else {
          if (data.status != 'ok') {
            return cb(new Error(data.messsage), data, raw, response);
          }
          return cb(null, data, raw, response);
        }
      });
    });
  },

  deleteApps: function(appId, cb) {
    var appIds = [],
        ai,
        tempId,
        tempPayload;

    appIds = 'string' === typeof appId ? [appId] : appId;

    async.map(appIds, apps.deleteApp, function(err, results) {
      cb(err, results);
    });
  }

};
