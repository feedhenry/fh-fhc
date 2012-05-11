"use strict";

var async = require("async");
var api = require("./api");
var fhreq = require("./utils/request");

var build = module.exports = function(options, appId, args, cb) {
  var uri = "wid/" + options.domain + "/" + args.destination + "/" + appId + "/deliver",
      payload = "generateSrc=false";

  if (!args.destination) return cb(new Error("Missing 'destination' parameter"), null);
  if (!args.version) return cb(new Error("Missing 'version' parameter"), null);

  if (!args.config) args.config = 'debug';
  if (!args.stage) args.stage = false;

  if (args.config == 'release' || args.config == 'distribution') {
    if (!args.keypass) return cb(new Error("Missing 'keypass' parameter"), null);
    if (!args.certpass) return cb(new Error("Missing 'certpass' parameter"), null);
    args.privateKeyPass = args.keypass; // naff..
  }

  if(args.destination == "iphone" || args.destination == "ipad") {
    args.deviceType = args.destination;
  }

  for (var i in args) {
    payload += "&" + i + "=" + args[i];
  }

  api.doRemoteCall(options, uri, payload, "Error building app: ", cb);
};
