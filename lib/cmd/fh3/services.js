module.exports = services;

services.desc = "Manage FeedHenry Services";
services.usage = "fhc services [list]"
    + "\nfhc services create <service-title> [<template-id>] --env=environment"
    + "\nfhc services update <service-id> <prop-name> <value>"
    + "\nfhc services read <service-id>"
    + "\nfhc services delete <service-id>"
    + "\nfhc services data-sources <service-id>"
    + "\nwhere <service-id> is a service id"
    + "\nwhere <type> is a valid service type [default]"
    + "\nIf --env is provided and the app is deployed, it will be deployed to the specified environment automatically. Set it to 'none' if it should not be deployed to anywhere.";

var common = require("../../common");
var fhreq = require("../../utils/request");
var fhc = require("../../fhc");
var ini = require('../../utils/ini');
var _ = require('underscore');
var templates = require('../common/templates.js');

function unknown(message, cb) {
  return cb(message + "\n" + "Usage: \n" + services.usage);
}

function services(argv, cb) {
  var args = argv._;
  if (args.length === 0) return listServices(args, cb);

  var action = args[0];
  if ("list" === action) {
    return listServices(args, cb);
  } else if ("create" === action) {
    var deployEnvironment = ini.getEnvironment(argv, true);
    return createService(args, deployEnvironment, cb);
  } else if ("update" === action) {
    return updateService(args, cb);
  } else if ("delete" === action) {
    return deleteService(args, cb);
  } else if ("read" === action) {
    if (args.length !== 2) return cb(services.usage);
    return readService(args[1], cb);
  } else if ("data-sources" === action) {
    if (args.length !== 2) {
      return cb(services.usage);
    }
    return listServiceDataSources(args[1], cb);
  } else {
    return unknown("Invalid service action " + action, cb);
  }
}

/**
 * Listing All Data Sources Associated With A Service.
 * @param serviceId
 * @param cb
 */
function listServiceDataSources(serviceId, cb){

  readService(serviceId, function(err, service){
    if(err){
      return cb(err);
    }

    common.doGetApiCall(fhreq.getFeedHenryUrl(), "api/v2/services/" + service.apps[0].guid + "/data_sources", "Error reading Service data sources. ", function(err, dataSources){
      if (ini.get('table') === true) {
        services.table = common.createTableForDataSources(dataSources || [], service);
      }

      cb(err, dataSources);
    });
  });
}

function listServices(args, cb) {
  common.listServices(function (err, projs) {
    if (err) return cb(err);
    if (ini.get('table') === true) {
      services.table = common.createTableForProjects(projs);
    }

    if(ini.get('bare') !== false) {
      var props = ['guid'];
      if (typeof ini.get('bare') === 'string') {
        props = ini.get('bare').split(" ");
      }
      services.bare = '';
      _.each(projs, function(proj) {
        if (services.bare !== '') services.bare = services.bare + '\n';
        for (var i=0; i<props.length; i++) {
          services.bare = services.bare + proj[props[i]] + " ";
        }
      });
    }

    return cb(err, projs);
  });
}

function createService(args, deployEnv, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }

  var title = args[1];
  var templateId = args[2] || "new-service";
  var payload =  {
    title: title,
    apps:[],
    services:[]
  };

  function doCall(template, cb) {
    payload.template = template;
    if(deployEnv){
      templates.setDeployEnvironment(payload, deployEnv);
    }
    common.doApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors", payload, "Error creating service: ", cb);
  }


  // Hackity hack: fh-art requires a custom blank template (which has no apps)
  // to facilitate this we have a sneaky 3'rd param here where we pass the template object in directly
  // This would be much cleaner if there was an API for creating Service Templates
  if (args[3] && (typeof args[3] === 'object')) {
    doCall(args[3], cb);
  } else {
    templates({ _ : ['services', templateId] }, function(err, template) {
      if (err) return cb(err);
      if (!template) return cb('Template not found: ' + templateId);
      doCall(template, cb);
    });
  }
}

function updateService(args, cb) {
  if (args.length < 4) {
    return unknown("Invalid arguments", cb);
  }
  var serviceId = args[1];
  var propName = args[2];
  var value = args[3];

  readService(serviceId, function(err, service) {
    if (err) return cb(err);
    service[propName] = value;
    fhreq.PUT(fhreq.getFeedHenryUrl(), "box/api/connectors/" + serviceId, service, function (err, remoteData, raw, response) {
      if (err) return cb(err);
      if (response.statusCode !== 200) return cb(raw);
      return cb(null, remoteData);
    });
  });
}

function readService(serviceId, cb) {
  common.doGetApiCall(fhreq.getFeedHenryUrl(), "box/api/connectors/" + serviceId, "Error reading Service: ", cb);
}

function deleteService(args, cb) {
  if (args.length < 2) {
    return unknown("Invalid arguments", cb);
  }
  var endpoint = "box/api/connectors/" + fhc.appId(args[1]);
  common.doDeleteApiCall(fhreq.getFeedHenryUrl(), endpoint, {},  "Error deleting service: ", function (err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

// bash completion
services.completion = function (opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "services") argv.unshift("services");
  if (argv.length === 2) {
    return cb(null, ["create", "update", "read", "delete", "list"]);
  }

  if (argv.length === 3) {
    var action = argv[2];
    switch (action) {
      case "read":
      case "update":
      case "delete":
        common.getServiceIds(cb);
        break;
      default: return cb(null, []);
    }
  }
};
