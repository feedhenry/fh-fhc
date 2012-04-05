module.exports = version;
version.usage = "fhc version";

var util = require('util');
var fhc = require("./fhc");
var fhreq = require("./utils/request");

// Get FeedHenry platform version
function version (args, cb) {
  var url = fhreq.getFeedHenryUrl();
  if (args.length === 1) url = args[0];

  fhreq.GET(url, "box/srv/1.1/tst/version", function (err, remoteData, raw, response) {
    if (err) return cb(err);
    if (response.statusCode === 200) {
      remoteData.status = "ok";
      remoteData.statusCode = 200;
      version.message = "FeedHenry " + remoteData.Environment + " " + remoteData.Release + " " + remoteData["Revision Date"];
      return cb(err, remoteData);  
    }
    return cb(undefined, {status: 'error', error: remoteData, statusCode: response.statusCode});
  });
};

//Ping an app's sys info ping endpoint
function ping (args, cb) {
  // Proxy to app ping
};
