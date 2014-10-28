var async = require('async'),
_ = require('underscore'),
request = require('request'),
urlUtils = require('url'),
fhc = require('./fhc'),
common = require('./common'),
fhreq = require('./utils/request');

function _buildUsage(cmd){
  var usage = [];
  _.each(cmd.describe, function(description, key){
    var argument = "";
    argument = "--" + key + "=" + "<" + key + ">";
    
    // Optional params are wrapped in []'s'
    if (cmd.demand.indexOf(key)===-1){
      argument = "[" + argument + "]";
    }
    usage.push(argument);
  });
  return usage.join(' ');
}

function _handleRequestGenerically(params, cb){
  var url = this.url,
  headers = {},
  method = this.method,
  cookie = fhc.config.get("cookie");
  
  if (cookie != undefined) {
    headers.cookie = "feedhenry=" + cookie + ";";
  }
  if (typeof url === 'function'){
    url = url(params);
  }
  
  var opts = {
    url : urlUtils.resolve(fhreq.getFeedHenryUrl(), url),
    headers : headers,
    method : method,
    proxy : fhc.config.get("proxy"),
    body : (method === 'get' || method === 'delete') ? undefined : params,
    json : true
  };
  
  request(opts, function(err, response, body){
    if (err){
      return cb(err.toString());
    }
    
    if (response.statusCode.toString()[0] !== '2'){
      return cb('Error - not 2xx status code.');
    }
    return cb(null, body);
  });
};

module.exports = function(cmd){
  cmd.usage = _buildUsage(cmd);
  
  var cmdFn = function(argv, cb){
    var preCmd = cmd.preCmd,  
    customCmd = cmd.customCmd,
    postCmd = cmd.postCmd,
    series = [];
    
    // Ensure our series always gets the args as the first param in the chain, regardless of if we have a preFn or not
    series.push(function(cb){
      return cb(null, argv);
    });
    
    if (typeof preCmd === 'function'){
      // Apply a useful scope in these functions
      var pre = function(params, cb){
        preCmd.apply(cmd, [params, cb]);
      }
      series.push(pre);
    }
    
    if (typeof customCmd === 'function'){
      // Apply a useful scope
      var custom = function(params, cb){
        customCmd.apply(cmd, [params, cb]);
      };
      series.push(custom);
    } else {
      series.push(function(params, cb){
        return _handleRequestGenerically.apply(cmd, [params, cb]);
      });
      
    }
      
    if (typeof postCmd === 'function'){
      // Apply a useful scope in these functions
      var post = function(params, cb){
        postCmd.apply(cmd, [params, cb]);
      }
      series.push(post);
    }
    
    return async.waterfall(series, cb);
  }
  
  _.extend(cmdFn, cmd); // Applies things like .usage, .desc so we can access them later
  return cmdFn;
};
