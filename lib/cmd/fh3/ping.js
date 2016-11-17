/* globals i18n */
module.exports = ping;
ping.ping = ping;

ping.usage = "fhc ping <app-id> --env=<environment>";
ping.desc = i18n._("Ping a FeedHenry cloud app");

var log = require("../../utils/log");
var fhc = require("../../fhc");
var common = require("../../common");
var ini = require('../../utils/ini');
var request = require('request');
var util = require('util');

// Main ping entry point
function ping(argv, cb) {
  var args = argv._;
  if (args.length === 0) {
    return cb(ping.usage);
  }

  var appId = fhc.appId(args[0]);
  var environment = ini.getEnvironment(argv);

  // lookup host for environment and ping it directly
  var params = {
    app: appId,
    env: environment
  };
  log.info('host params' + util.inspect(params));
  fhc.app.hosts(params, function(err, host) {
    log.silly('host res:' + util.inspect(arguments));
    if (err) return cb(err);
    var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
    proxyRequest(host.url + '/sys/info/ping', function(err, res, body) {
      log.silly('req res:' + util.inspect(arguments));
      if (err) return cb(err);

      log.info('res.statusCode:' + res.statusCode + ' body:' + body);
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return cb(util.format(i18n._('Non 2xx response "%s"'), body));
      }

      return cb(null, body);
    });
  });
}

// bash completion
ping.completion = function (opts, cb) {
  common.getAppIds(cb);
};
