var fhc = require("../../../../fhc");
var url = require('url');
var request = require('request');
var _ = require('underscore');

module.exports = function(baseParams){
  return {
    'demand' : ['app', 'env', 'userKey', 'appKey'],
    'alias' : {
      'app' : 'a',
      'env' : 'e',
      0 : 'app',
      1 : 'env'
    },
    'describe' : {
      'app' : 'Unique 24 character GUID of the app you want to retrieve env vars from',
      'env' : 'Environment to look up the env vars for',
      'userKey' : 'User API key - see `fhc keys user`',
      'appKey' : 'App API Key - see `fhc app read` command, look for `apiKey` property'
    },
    'customCmd' : function(params, cb){
      fhc.app.hosts({
        app : params.app,
        env : params.env
      }, function(err, hostsResult){
        if (err){
          return cb(err);
        }
        var dbUrl = url.resolve(hostsResult.url, '/mbaas/db');
        var act = baseParams.act || 'list';
        var jsonData;
        var formData;
        if (act === 'import'){
          formData = {
            "__fh.appkey" : params.appKey,
            "__fh.userkey" : params.userKey,
            act : act,
            filename : "import.zip",
            toimport : {
              value : params.file,
              options : {
                contentType : 'application/zip',
                filename : 'import.zip'
              }
            }
          }
        }else{
          jsonData = _.extend({
            __fh : {
              appkey : params.appKey,
              userkey : params.userKey
            },
            act : act
          }, params);
        }
        return request({
          url : dbUrl,
          method : "POST",
          json : jsonData,
          formData : formData,
          // null sends us back a buffer, undefined .toString()'s the buffer
          encoding : (act === 'export') ? null : undefined
        }, function(err, response, body){
          if (err){
            return cb(err);
          }
          if (response.statusCode !== 200){
            if (body instanceof Buffer){
              // errors coming from export operation come in as a buffer, since we expect a file back. Translate them into something human readable. 
              body = body.toString();
            }
            return cb('Non-200 status code: ' + response.statusCode + '\n' + JSON.stringify(body));
          }
          return cb(null, body);
        });  
      });
      
    }
  };
};
