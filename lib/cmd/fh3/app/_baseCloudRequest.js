var common = require('../../../common.js');
var read = require('../../../read.js').read;
var log = require("../../../utils/log");
var request = require('request');
module.exports = function(requestType){
  return { 
    'demand' : ['a', 'fn', 'data', 'e'],
    'alias' : {
      'a' : 'app',
      'e' : 'env'
    },
    'describe' : {
      'a' : 'Unique 24 character GUID of the app you want to do a request on',
      'e' : 'Environment within which the request should be performed',
      'fn' : 'Cloud function name to call',
      'data' : 'Request body to send thru'
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
            return cb('App ' + params.app + ' not found for environment ' + params.env);
          }
          
          if (!appUrl.match(/\/$/)) appUrl = appUrl + '/';
          log.silly(appName, "Act call appName");
          log.verbose(appUrl + "cloud/" + funct, "Act call appUrl");
          
          if (requestType === 'act'){
            self.url = appUrl + "cloud/" + params.fn;
          }else{
            self.url = appUrl + params.path;
          }
          
          return cb(null, params);
        });
      });
    },
    'customCmd' : function(params, cb){
      var headers = {
        "X-FH-AUTH-APP": this.key
      },
      data = params.data;

      // post to /cloud
      request({uri: this.url, headers: headers, method: 'POST', json: data}, function (err, response, body) {
        if(err){
          return cb(err);
        } 
        log.verbose(response.statusCode, "Act call response statusCode");
        log.silly(body, "Act call response body");
        if(response.statusCode !== 200){
          return cb("Bad response: " + util.inspect(body) + " code: " + response.statusCode);
        } 
        return cb(undefined, body);
      });
    }
  };
 
   
}
