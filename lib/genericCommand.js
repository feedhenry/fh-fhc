var async = require('async'),
_ = require('underscore'),
fhc = require('./fhc'),
common = require('./common'),
usage = require('./usage'),
fhreq = require('./utils/request');

function _parseYargs(cmd){
  var yargs = require('yargs')
  .usage(cmd.usage)
  .demand(cmd.demand)
  .alias(cmd.alias)
  .describe(cmd.describe)
  .default(cmd.default);
  _.each(cmd.examples, function(ex){
    yargs.example(ex.cmd, ex.desc || '');
  });
  return yargs.argv;
}

module.exports = function(cmd, cb){
  
  if (!cmd.usage){
    return cb(usage(cmd));
  }
  
  var preCmd = cmd.preCmd,  
  customCmd = cmd.customCmd,
  postCmd = cmd.postCmd,
  series = [],
  url = cmd.url,
  argv = _parseYargs(cmd); // TODO Causes CB never called
    
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
      return common.doApiCall(fhreq.getFeedHenryUrl(), url, params, "Error getting app endpoints: ", cb)
    });
  }
    
  if (typeof postCmd === 'function'){
    series.push(postCmd);
  }
  
  return async.waterfall(series, cb);
};
