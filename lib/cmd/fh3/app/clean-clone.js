'use strict';

var millicore = require("../../../utils/millicore.js");
var fhreq = require("../../../utils/request");

module.exports = cleanClone;

cleanClone.usage = "fhc app clean-clone <appId>";
cleanClone.desc = i18n._("Performs a clean clone of a git repo within the studio to resolve potential git issuse");

function cleanClone (argv, cb) {
  var appId = argv.appId;
  var payload = {
    clean: true
  };

  if (!appId) {
    return cb(
      new Error(i18n._('appId is required to perform a clean clone'))
    );
  }

  millicore.widgForAppId(appId, function (err, widgId) {
    if (err) {
      return cb(err);
    }
    //Sample URL: https://domain.feedhenry.com/box/api/connectors/{widget}/apps/{appId}/pull
    fhreq.POST(fhreq.getFeedHenryUrl(), "/box/api/connectors/" + widgId + '/apps/' + appId + "/pull", payload, function (err, data) {
      if (err) {
        return cb(err);
      } else if (!data.cacheKeys) {
        return cb(i18n._('Error in clean clone, unexpected response format'));
      } else {
        return cb(null, i18n._('clean clone successful'));
      }
    });
  });
}
