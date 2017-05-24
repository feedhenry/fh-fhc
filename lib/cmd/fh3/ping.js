/* globals i18n */
var log = require("../../utils/log");
var fhc = require("../../fhc");
var request = require('request');
var util = require('util');

module.exports = {
  'desc' : i18n._('Ping a cloud app'),
  'examples' : [{
    cmd : 'fhc ping --app=<app> --env=<environment>',
    desc : i18n._('Ping the cloud application <app-id>')}],
  'demand' : ['app', 'env'],
  'alias' : {
    'app':'a',
    'env':'e',
    0 : 'app',
    1 : 'env'
  },
  'describe' : {
    'app' : i18n._("Unique 24 character GUID of your cloud application."),
    'env' : i18n._("Unique 24 character GUID of the environment where this cloud application is deployed.")
  },
  'customCmd': function(argv, cb) {
    // lookup host for environment and ping it directly
    var params = {
      app: argv.app,
      env: argv.env
    };
    log.info('host params' + util.inspect(params));
    fhc.app.hosts(params, function(err, host) {
      log.silly('host res:' + util.inspect(arguments));
      if (err) {
        return cb(err);
      }
      var proxyRequest = request.defaults({'proxy': fhc.config.get("proxy")});
      proxyRequest(host.url + '/sys/info/ping', function(err, res, body) {
        log.silly('req res:' + util.inspect(arguments));
        if (err) {
          return cb(err);
        }

        log.info('res.statusCode:' + res.statusCode + ' body:' + body);
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return cb(util.format(i18n._('Non 2xx response "%s"'), body));
        }

        return cb(null, body);
      });
    });
  }
};