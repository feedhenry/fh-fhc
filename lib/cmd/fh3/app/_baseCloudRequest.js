/* globals i18n */
var common = require('../../../common.js');
var read = require('../../fh2/app/read.js').read;
var log = require("../../../utils/log");
var util = require('util');
var fhc = require("../../../fhc");
var request = require('request');
var url = require('url');
var os = require('os');

module.exports = function(requestType){
  return {
    'demand' : ['app', 'data', 'env'],
    'alias' : {
      'app' : 'a',
      'env' : 'e',
      0 : 'app'
    },
    'describe' : {
      'app' : i18n._('Unique 24 character GUID of the app you want to do a request on'),
      'env' : i18n._('Environment within which the request should be performed'),
      'data' : i18n._('Request body to send thru')
    },
    'preCmd' : function(params, cb){
      var self = this,
        funct = params.fn;
      read({ _ : [params.app]}, function (err, res) {
        if(err){
          return cb(err);
        }

        var inst = res.inst;
        self.key = inst.apiKey;

        // Now lookup the hostname for this environment
        common.getAppNameUrl(params.app, params.env, function(err, appName, appUrl) {
          if (err || !appName || !appUrl){
            return cb(util.format(i18n._('App %s not found for environment %s'), params.app, params.env) + ' - ' + err.toString());
          }

          if (!appUrl.match(/\/$/)) appUrl = appUrl + '/';
          log.silly(appName, "Act call appName");
          log.verbose(appUrl + "cloud/" + funct, "Act call appUrl");

          if (requestType === 'act'){
            self.url = url.resolve(appUrl, "cloud/" + params.fn);
          }else{
            self.url = url.resolve(appUrl, params.path);
          }

          return cb(null, params);
        });
      });
    },
    'customCmd' : function(params, cb){
      var headers = {
          "X-FH-AUTH-APP": this.key,
          "User-Agent": "FHC/" + fhc._version + ' ' + os.platform() + '/' + os.release()
        },
        data = params.data;

      // post to /cloud
      request({uri: this.url, headers: headers, method: 'POST', proxy: fhc.config.get("proxy"), body: data, json : true}, function (err, response, body) {
        if(err){
          return cb(err);
        }
        log.verbose(response.statusCode, "Act call response statusCode");
        log.silly(body, "Act call response body");
        if(response.statusCode !== 200){
          return cb(i18n._("Bad response: ") + util.inspect(body) + i18n._(" code: ") + response.statusCode);
        }
        return cb(undefined, body);
      });
    }
  };
};
