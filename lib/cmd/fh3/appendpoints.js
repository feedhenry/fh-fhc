var common = require("../../common");
var fhc = require("../../fhc");

module.exports = function(params, cb){
  console.log(fhc.target);
  var url = fhreq.getFeedHenryUrl() + "api/v2/app/" + fhc.target + "/endpoints",
  body = {
    appName : params.app,
    dynoName : params.env
  };
  common.doApiCall(url, body, "Error getting app endpoints: ", cb);
}
