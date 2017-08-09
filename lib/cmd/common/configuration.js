/* globals i18n */

module.exports = configuration;
configuration.list = list;

var util = require('util');

// TODO - would be nice to get the destinations from the FeedHenry API
var destinations = ['studio', 'android', 'embed', 'iphone', 'ipad', 'blackberry', 'windowsphone7'];
configuration.desc = i18n._("Manage client app configuration properties");
configuration.usage = "\nfhc configuration [list] <app-id>"
           + "\nfhc configuration [list] <app-id> <destination>"
           + "\nfhc configuration set <app-id> <destination> <key> <value>"
           + util.format(i18n._("\nwhere destination can be one of: %s or 'all'"), destinations.join(', '));

var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require('../../common.js');
var async = require('async');

// main configuration entry point
function configuration(argv, cb) {
  var args = argv._;
  if (args.length < 1 || args.length > 5) {
    return usage(cb);
  }

  // defaults.. 'list all' operation if 1 args passed, 'list <dest>' if 2..
  if (args.length === 1) {
    return list(args[0], 'all', cb);
  }

  var action = args[0];
  if (action === 'list') {
    if (args.length !== 2 && args.length !== 3) {
      return usage(cb);
    }
    list(args[1], args[2], cb);
  } else if (action === 'set') {
    if (args.length !== 5) {
      return usage(cb);
    }
    set(args[1], args[2], args[3], args[4], cb);
  } else if (args.length === 2) {
    return list(args[0], args[1], cb);
  } else {
    return usage(cb);
  }
}

// list our destination props
function list(appId, destination, main_cb) {
  if (destination === undefined) {
    destination = 'all';
  }
  // helper func for async
  function listForDestination(d, cb) {
    var payload = {payload:{"template":appId, destination: d}};
    var uri = "box/srv/1.1/ide/" + fhc.curTarget + "/config/list";
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error listing destination config: "), cb);
  }

  if (destination === "all") {
    async.map(destinations, listForDestination, function(err, results) {
      if (err) {
        return main_cb(err);
      }
      var data = {};
      for (var i=0; i<results.length; i++) {
        data[destinations[i]] = results[i];
      }
      return main_cb(undefined, data);
    });
  } else {
    listForDestination(destination, main_cb);
  }
}

//
// In order to set a property, you must first get all the properties, change the property you want, then re-submit them all
//
function set(appId, destination, k, v, main_cb) {
  // helper func for async
  function setForDestination(d, cb) {
    list(appId, d, function(err, config) {
      if (err) {
        return cb(err);
      }
      var payload = {payload:{"template":appId, destination: d, config: config}};
      payload.payload.config[k] = v;
      var uri = "box/srv/1.1/ide/" + fhc.curTarget + "/config/update";
      common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, i18n._("Error setting destination config: "), cb);
    });
  }

  if (destination === "all") {
    async.map(destinations, setForDestination, main_cb);
  } else {
    setForDestination(destination, main_cb);
  }
}


function usage(cb) {
  cb(i18n._("Usage:") + "\n" + configuration.usage);
}

// bash completion
configuration.completion = function(opts, cb) {
  var argv = opts.conf.argv.remain;
  if (argv[1] !== "configuration") {
    argv.unshift("configuration");
  }
  if (argv.length === 2) {
    var cmds = ["list", "set"];
    if (opts.partialWord !== "l") {
      cmds.push("list");
    }
    return cb(null, cmds);
  }

  var action = argv[2];
  switch (action) {
  case "list":
  case "set":
    common.getAppIds(cb);
    break;
  default:
    return cb(null, []);
  }
};
