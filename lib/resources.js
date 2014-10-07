
module.exports = resources;

resources.usage = "\nfhc resources [--app=appId] --env=<environment>"
            + "\n Resources across FeedHenry. Limit to an app using the --app flag, limit to an environment using --env."
            + "\n Omit the --app flag for an aggregate view, or use --app=* to show resources for every app individually.";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var ini = require('./utils/ini');

// main resources entry point
function resources (args, cb) {
  var target = ini.getEnvironment(args, undefined),
  app = ini.get('app');
  
  if (typeof app ==='undefined' || app==='*'){
    return doEnvironmentResources(target, app==='*', cb);
  }else{
    return doAppResources(fhc.appId(app), target, cb);  
  }
}

// do resources call
function doAppResources(app, target, cb) {
  var type = 'resources';
  if (!target){
    return cb('Error - app resources need to specify an environment using the --env=<environment> flag')
  }

  // constuct uri and payload
  var uri = "box/srv/1.1/ide/" + fhc.target + "/app/" + type;
  var payload = {payload:{guid: app, deploytarget: target}};

  common.doApiCall(fhreq.getFeedHenryUrl(), uri, payload, "Error getting resources for app: ", function(err, data) {
    if(err) return cb(err);
    log.silly(data, "setstagingconfig");
    if(ini.get('table') === true && data.data) {
      resources.table = common.createTableForResources(data.data);
    }
    return cb(undefined, data);
  });
}

function doEnvironmentResources(env, verbose, cb) {
  var url = "box/srv/1.1/environments";
  if (env){
    url = url + '/' + env;
  }else{
    log.warn('No environment specified. Specify using --env=<environment> flag. Available environments: ')
  }
  if (verbose){
    url = url + '/resources';
  } 
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

// bash completion
resources.completion = function (opts, cb) {
  common.getAppIds(cb);
};
