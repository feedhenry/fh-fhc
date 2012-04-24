"use strict";

var async = require("async");
var api = require("./api");
var fhreq = require("./utils/request");


var build = module.exports = {

  doBuild: function(options, appId, args, cb) {
    var uri = api.ENDPOINT + "wid/" + fhc.domain + "/" + args.destination + "/" + args.app + "/deliver";

    function doCall() {

    }

  }

}

function doBuild(args, cb) {
  var uri = "box/srv/1.1/wid/" + fhc.domain + "/" + args.destination + "/" + args.app + "/deliver";
  var doCall = function(){
    var pl = "generateSrc=false";
    

    var payload = argsToPayload(args);
    common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error reading app: ", function(err, data) {
      if(err) return cb(err);
      var keys = [];

      if(data.cacheKey) keys.push(data.cacheKey);
      if(data.stageKey) keys.push(data.stageKey);

      if(keys.length > 0) {
        async.map(keys, common.waitFor, function(err, results) {
          if (err) return cb(err);
          if (results[0] !== undefined) {
            var build_asset = results[0][0].action.url;

            downloadBuild(args, build_asset, './', function(err, data) {
              if (err) return cb(err); 
              if (data) {
                results.push({
                  download: data
                });
              }
              return cb(err, results);
            });
          }
        });
      } else {
        return cb(err, data);
      }    
    });
  }
  
  if((args.destination === "iphone" || args.destination === "ipad") && args.provisioning){
    var resourceUrl = "/box/srv/1.1/dev/account/res/upload";
    var fields = {dest: args.destination, resourceType: 'provisioning', buildType: args.config, templateInstance: args.app};
    fhreq.uploadFile(resourceUrl, args.provisioning, fields, "application/octet-stream", function(err, data){
      if(data.result && data.result === "ok"){
        log.info("Provisioning profile uploaded");
        doCall();
      } else {
        cb(err, "Failed to upload provisioning profile. Response is " + JSON.stringify(data));
      }
    })
  } else {
    doCall();
  }
};
