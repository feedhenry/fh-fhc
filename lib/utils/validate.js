var _ = require('underscore');
module.exports = function(cmd){
  var yargs = require('yargs')
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
