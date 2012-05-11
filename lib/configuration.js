"use strict";

var api = require("./api");
var async = require('async');
var destinations = [
  'studio',
  'android',
  'embed',
  'iphone',
  'ipad',
  'blackberry',
  'windowsphone7',
  'nokiawrt'
];

var configuration = module.exports = {

  // list our destination props
  list: function (options, appId, destination, main_cb) {
    if(!destination) destination = 'all';
    // helper func for async
    function listForDestination(d, cb) {
      var payload = {
        payload: {
          "template": appId,
          destination: d
        }
      };
      api.doConfigCall(options, "list", payload, "Error listing destination config: ", cb);
    }

    if(destination === "all") {
      async.map(destinations, listForDestination, function (err, results){
        if (err) return main_cb(err, null);
        var data = {};
        for (var i = 0; i < results.length; i++) {
          data[destinations[i]] = results[i];
        }
        return main_cb(null, data);
      });
    } else {
      listForDestination(destination, main_cb);
    }
  },

  // In order to set a property, you must first get all the properties, change the property you want, then re-submit them all
  set: function(options, appId, destination, k, v, main_cb) {
    // helper func for async
    function setForDestination(d, cb) {
      configuration.list(options, appId, d, function(err, data, raw, response){
        if(err) return cb(err, data, raw, response);

        var payload = {
          payload: {
            template: appId,
            destination: d,
            config: data
          }
        };
        payload.payload.config[k] = v;

        api.doConfigCall(options, "update", payload, "Error setting destination config: ", cb);
      });
    }
    
    if(destination === "all") {
      async.map(destinations, setForDestination, main_cb);
    } else {
     setForDestination(destination, main_cb);
    }
  }

};
