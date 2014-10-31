
module.exports = resources;

resources.desc = "List resources for a FeedHenry Cloud Environment";
resources.usage = "\n Resources across FeedHenry."
            +"\nfhc resources cache flush --env=<environment>"
            +"\nfhc resources cache set --env=<environment> --type=<percent|size> --value=<value>" + 
            +"\ne.g. fhc resources cache flush --env=dev"
            +"\ne.g. fhc resources cache set --type=percent --value=50 --env=dev"
            +"\ne.g. fhc resources cache set --type=size --value=524288000 --env=live"
            +"\nTo set unlimited cache size, use 'fhc cache set --type=size --value=-1'\n";

var log = require("../../utils/log");
var fhc = require("../../fhc");
var fhreq = require("../../utils/request");
var common = require("../../common");
var ini = require('../../utils/ini');

// main resources entry point
function resources (argv, cb) {
  var args = argv._;
  var env = ini.getEnvironment(args, undefined),
  domain = ini.get('domain', 'user');
  
  if (args[0] === 'cache'){
    return doCache(args, domain, env, cb);
  }
  
  
  return doEnvironmentResources(domain, env, true, cb);
}

function doEnvironmentResources(domain, env, verbose, cb) {
  var url = "api/v2/resources";
  if (env){
    url = url + '/' + domain + '/' + env;
  }else{
    return cb('No environment specified. Specify using --env=<environment> flag. Available environments: ')
  }
  
  common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function doCache (args, domain, target, cb) {
  if (args.length !==2){
    return cb('Invalid arguments - must specify command flush or set.' + resources.usage);
  }
  
  var action = args[1],
  type, value;
  
  if (action === 'flush'){
    return doCacheFlush(domain, target, cb);
  }else if (action === 'set'){
    type = ini.get('type');
    value = ini.get('value');
    if (!type || !value){
      return cb('Missing cache set param type or value');
    }
    return doCacheSet(domain, target, type, value, cb);
  }else{
    return cb('Invalid action. \n' + resources.usage);
  }
}


function doCacheFlush(domain, env, cb) {
  var url = "api/v2/resources/" + domain + "/" + env + "/cache/flush";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {env: env}, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

function doCacheSet(domain, env, type, value, cb) {
  var url = "api/v2/resources/" + domain + "/" + env + "/cache/set";
  common.doApiCall(fhreq.getFeedHenryUrl(), url, {cache: {type: type, value: value}}, "Call failed: ", function(err, data) {
    if (err) return cb(err);
    return cb(err, data);
  });
}

// bash completion
resources.completion = function (opts, cb) {
  common.getAppIds(cb);
};
