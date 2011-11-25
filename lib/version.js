module.exports = version;
version.usage = "fhc version";

var fhc = require("./fhc"),
fhreq = require("./utils/request");

// Get FeedHenry platform version
function version (args, cb) {  
  fhreq.GET(fhreq.getFeedHenryUrl(), "box/srv/1.1/tst/version", function (err, remoteData, raw, response) {
    return cb(err, remoteData);
  });
};
