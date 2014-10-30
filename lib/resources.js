
module.exports = resources;

resources.usage = "\nfhc resources [--app=appId] --env=<environment>"
            + "\n Resources across FeedHenry. Limit to an app using the --app flag, limit to an environment using --env."
            + "\n Omit the --app flag for an aggregate view, or use --app=* to show resources for every app individually."
            +"\nfhc resources cache flush --env=<environment>"
            +"\nfhc resources cache set --env=<environment> --type=<percent|size> --value=<value>" + 
            +"\ne.g. fhc resources cache flush --env=dev"
            +"\ne.g. fhc resources cache set --type=percent --value=50 --env=dev"
            +"\ne.g. fhc resources cache set --type=size --value=524288000 --env=live"
            +"\nTo set unlimited cache size, use 'fhc cache set --type=size --value=-1'\n";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var ini = require('./utils/ini');

// main resources entry point
function resources (args, cb) {
  var target = ini.getEnvironment(args, undefined),
  app = ini.get('app');
  
  if (args[0] === 'cache'){
    return doCache(args, target, cb);
  }
  
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

function doCache (args, target, cb) {
  if (args.length !==2){
    return cb('Invalid arguments - must specify command flush or set.' + resources.usage);
  }
  
  var action = args[1],
  type, value;
  
  if (action === 'flush'){
    return doCacheFlush(target, cb);
  }else if (action === 'set'){
    type = ini.get('type');
    value = ini.get('value');
    if (!type || !value){
      return cb('Missing cache set param type or value');
    }
    return doCacheSet(target, type, value, cb);
  }else{
    return cb('Invalid action. \n' + resources.usage);
  }
}


function doCacheFlush(env, cb) {
  var url = "box/srv/1.1/environments/" + env + "/cache/flush";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {env: env}, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function doCacheSet(env, type, value, cb) {
  var url = "box/srv/1.1/environments/" + env + "/cache/set";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {cache: {type: type, value: value}}, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

// bash completion
resources.completion = function (opts, cb) {
  common.getAppIds(cb);
};
