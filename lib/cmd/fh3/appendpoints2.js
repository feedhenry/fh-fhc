var common = require("../../common"),
fhreq = require('../../utils/request'),
fhc = require("../../fhc");

module.exports = function(argv, cb){
  var args = argv._;
  var path = "api/v2/app/" + fhc.target + "/endpoints",
  body = {
    appName : argv.app,
    dynoName : argv.env
  };
  common.doApiCall(fhreq.getFeedHenryUrl(), path, body, "Error getting app endpoints: ", cb);
}
