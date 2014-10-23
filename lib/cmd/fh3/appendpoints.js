var common = require("../../common"),
fhreq = require('../../utils/request'),
fhc = require("../../fhc");

module.exports = function(argv, cb){
  var args = argv._;
  var url = fhreq.getFeedHenryUrl() + "api/v2/app/" + fhc.target + "/endpoints",
  body = {
    appName : params.app,
    dynoName : params.env
  };
  common.doApiCall(url, body, "Error getting app endpoints: ", cb);
}
