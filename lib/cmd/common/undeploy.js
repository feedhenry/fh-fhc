module.exports = undeploy;

undeploy.desc = "Undeploy a cloud app";
undeploy.usage = "fhc undeploy --id=<app-id> --env=<environment> --domain=<domain> (optional: --embed)" +
  "\ne.g. fhc undeploy --id=j7hslnrb257zkr4qzjndoqkl --env=dev --domain=testing";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

var DELETEAPP_ENDPOINT = "api/v2/mbaas/deleteapp";

/**
 * Main undeploy entry point
 * required args are id, env and domain
 * `embed` can be specified and will be sent in the request to supercore
 */
function undeploy(argv, cb) {
  if (!argv.id || !argv.env || !argv.domain) {
    return cb(undeploy.usage);
  }

  var deployTarget = ini.getEnvironment(argv);
  return undeployApp(argv.id, deployTarget, argv.domain, argv.embed, cb);
}

function undeployApp(appId, deployTarget, domain, embed, cb) {
  var body = {
    embed: embed || false
  };

  common.doApiCall(fhreq.getFeedHenryUrl(),
    [DELETEAPP_ENDPOINT, domain, deployTarget, appId].join("/"), body, "Error undeploying app: ",
    function (err, data) {
      if (err) return cb(err);
      log.info("App Undeployed");
      log.silly(data, "undeploy app");
      return cb(err, data);
    });
}

// bash completion
undeploy.completion = function (opts, cb) {
  common.getAppIds(cb);
};
