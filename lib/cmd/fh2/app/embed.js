/* globals i18n */
module.exports = embed;

embed.usage = "\nfhc app embed <appId> --env=<environment>";
embed.desc = i18n._("Build your Application for Embed Target");

var fhc = require("../../../fhc");
var fhreq = require("../../../utils/request");
var common = require("../../../common");
var async = require('async');
var ini = require('../../../utils/ini');

function embed(argv, cb) {
  var args = argv._;
  if (args.length < 1) {
    return cb(i18n._("Invalid arguments for fhc embed.") + ' ' + i18n._("Usage: ") + embed.usage);
  }
  var appGuid = args[0];
  var env = ini.getEnvironment(argv);
  doDeploy(appGuid, env, cb);
}

function doDeploy(appGuid, env, cb) {
  var app = fhc.appId(appGuid);
  var uri = "box/srv/1.1/wid/" + fhc.curTarget + "/embed/" + app + "/deliver";
  common.doApiCall(fhreq.getFeedHenryUrl(), uri + "?checktype=true", {}, i18n._("Error: "), function (err, res) {
    if (err) return cb(err);
    if (typeof res === "string") {
      res = JSON.parse(res);
    }
    if (res.result) {
      common.doApiCall(fhreq.getFeedHenryUrl(), uri + "?node=true", {
        "env": env,
        "generateSrc": false
      }, i18n._("Error reading app: "), function (err, data) {
        if (err) return cb(err);
        var keys = [];
        if (data.cacheKey) keys.push(data.cacheKey);
        if (data.stageKey) keys.push(data.stageKey);
        if (keys.length > 0) {
          async.map(keys, common.waitFor, function (err, results) {
            if (err) return cb(err);
            if (results[0] !== undefined) {
              var build_asset = results[0][0].action.url;
              return cb(err, build_asset);
            }
          });
        } else {
          return cb(err, data);
        }
      });
    } else {
      var feedHenryUrl = fhreq.getFeedHenryUrl();
      if (feedHenryUrl.substring(0, 8) !== 'https://') {
        feedHenryUrl = 'https://' + feedHenryUrl;
      }
      return cb(null, "<script src='" + feedHenryUrl + "box/srv/1.1/wid/embed/" + app + "/deliver'></script>");
    }
  });

}
