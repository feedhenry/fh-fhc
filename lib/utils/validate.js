var _ = require('underscore');
module.exports = function(argv, cmd){
  
  var processArgs = _normaliseFlagsAndArs(argv, cmd);
  
  var yargs = require('yargs')(processArgs)
  .exitProcess(false)
  .usage(cmd.usage)
  .demand(cmd.demand)
  .alias(cmd.alias)
  .describe(cmd.describe)
  _.each(cmd.examples, function(ex){
    yargs.example(ex.cmd, ex.desc || '');
  });
  _.each(cmd.defaults, function(value, key){
    yargs.default(key, value);
  });
  return yargs.argv;
}

/*
  Normalise positional aliases, e.g. 
  fhc app list 1a2b will become fhc app list --project=1a2b3c
 */
function _normaliseFlagsAndArs(argv, cmd){
  var processArgs = _.clone(process.argv);
  _.each(cmd.alias, function(alias, key){
    if (key.match(/[0-9]/)){
      var position = parseInt(key, 10),
      arg = argv._[position];
      var hasArgumentAtPosition = !isNaN(position) && typeof arg !== 'undefined';
      if (!argv.hasOwnProperty(key) && hasArgumentAtPosition){
        var idx = process.argv.indexOf(arg);
        
        argv[alias] = argv._[position];
        processArgs[idx] = '--' + alias + '=' + arg;
      }
    }
  });
  return processArgs;
}
