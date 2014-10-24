var async = require('async'),
_ = require('underscore'),
fhc = require('./fhc'),
common = require('./common'),
usage = require('./usage'),
fhreq = require('./utils/request');

module.exports = function(cmd){
  var cmdFn = function(argv, cb){
    if (!cmd.usage){
      if (argv._ && argv._.length === 0){
        return cb(usage(cmd));  
      }
    }
    
    var preCmd = cmd.preCmd,  
    customCmd = cmd.customCmd,
    postCmd = cmd.postCmd,
    series = [],
    url = cmd.url;
      
    if (!url){
      return cb('Error - command does not specify a url');
    }
    
    if (typeof url === 'function'){
      url = url(argv);
    }
    
    // Ensure our series always gets the args as the first param in the chain, regardless of if we have a preFn or not
    series.push(function(cb){
      return cb(null, argv);
    });
    
    if (typeof preCmd === 'function'){
      series.push(preCmd);
    }
    
    if (typeof customCmd === 'function'){
      series.push(customCmd);
    } else {
      series.push(function(params, cb){
        switch(cmd.method){
          case 'get':
            common.doGetApiCall(fhreq.getFeedHenryUrl(), url, "Error getting app endpoints: ", cb)
            break;
          case 'delete':
            common.doDeleteApiCall(fhreq.getFeedHenryUrl(), url, {}, "Error getting app endpoints: ", cb)
            break;
          default:
            common.doApiCall(fhreq.getFeedHenryUrl(), url, params, "Error getting app endpoints: ", cb)
            break;
        }
        return;
      });
      
    }
      
    if (typeof postCmd === 'function'){
      series.push(postCmd);
    }
    
    return async.waterfall(series, cb);
  }
  cmdFn.cmd = cmd;
  return cmdFn;
};
