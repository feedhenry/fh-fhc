
module.exports = cache;

cache.usage = "\nfhc cache flush --env=<environment>"
            "\nfhc cache set --env=<environment> --type=<percent|size> --value=<value>" + 
            "e.g. fhc cache flush --env=dev\n" +
            "e.g. fhc cache set percent 50 --env=dev\n" +
            "e.g. fhc cache set size 524288000 --env=live\n\n"+
           "To set unlimited cache size, use 'fhc cache set size -1'\n";

var log = require("./utils/log");
var fhc = require("./fhc");
var fhreq = require("./utils/request");
var common = require("./common");
var ini = require('./utils/ini');

function cache (args, cb) {
  if (args.length !==1){
    return cb('Invalid arguments - must specify command flush or set.' + cache.usage);
  }
  
  var action = args[0],
  target = ini.getEnvironment(args),
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
    return cb('Invalid action. \n' + cache.usage);
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
