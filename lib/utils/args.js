var _ = require('underscore');
var ini = require('./ini.js');

/*
  @param argsIntoCommand: the argv array
  Normalises an argv array, and returns a yargified object
 */
exports.normaliseToYargs = function(argsIntoCommand, cmd){
  argsIntoCommand = _normaliseFlagsAndArs(argsIntoCommand, cmd);
  var yargs = require('yargs')(argsIntoCommand);
  _setupArgsInIniConfig(yargs);
  return yargs;
};

/*
  Performs the actual validation
  @param yargs: An already set up yargs object, typically the response from normaliseToYargs
  @param cmd: Command definition
 */
exports.validate = function(yargs, cmd){
  _setupForValidation(yargs, cmd);
  // the return from this is never used, but caling .argv causes validation
  return yargs.argv;
};

/*
  Returns usage information
  @param yargs: An already set up yargs object, typically the response from normaliseToYargs
  @param cmd: Command definition
 */
exports.yargsUsage = function(cmd){
  var yargs = new require('yargs')([]); // If not provided, start anew - we don't care about the passed process.argv
  var compiledYargs = _setupForValidation(yargs, cmd);

  try{
    // Need to have appended the parsed yargs object - the call to which will fail, before we print out the help
    yargs.parse([]);
  }catch(err){
    // Intentionally empty - don't care about handling this, we just want the usage string.
  }

  return compiledYargs.help();
};

/*
  Normalise argument based positional aliases, e.g.
  fhc app list 1a2b will become fhc app list --project=1a2b3c
  Converts all arguments to flags
  @param argsIntoCommand: The arguments passed thru to the command, less the command itself (so no 'fhc' or 'app')
  @param cmd: The command definition object
 */
function _normaliseFlagsAndArs(argsIntoCommand, cmd){
  if (_.isEmpty(cmd.alias)){
    // bail on old style commands
    return argsIntoCommand;
  }
  var processArgs = _.clone(process.argv);
  _.each(cmd.alias, function(alias, key){
    if (key.match(/[0-9]/)){
      var position = parseInt(key, 10),
        arg = argsIntoCommand[position];
      var hasArgumentAtPosition = !isNaN(position) && typeof arg !== 'undefined' && !arg.match(/^--/);
      if (hasArgumentAtPosition){
        var idx = processArgs.indexOf(arg);
        if (idx > -1){
          processArgs[idx] = '--' + alias + '=' + arg;
        }
      }
    }
  });
  return processArgs;
}

/*
  Sets up a yargs object from a command definition, but doesn't trigger the validation yet
 */
function _setupForValidation(yargs, cmd){
  // yargs errors out with our numeric positional aliases which we process in _normaliseFlagsAndArs -
  // delete them before handing off to yargs
  var nonNumericAliases = _.clone(cmd.alias);
  _.each(nonNumericAliases, function(value, key){
    if (key.toString().match(/[0-9]/)){
      delete nonNumericAliases[key];
    }
  });
  yargs.exitProcess(false)
  .usage(cmd.usage)
  .demand(cmd.demand)
  .alias(nonNumericAliases)
  .describe(cmd.describe);
  _.each(cmd.examples, function(ex){
    yargs.example(ex.cmd, ex.desc || '');
  });
  _.each(cmd.defaults, function(value, key){
    yargs.default(key, value);
  });
  return yargs;
}

/*
  Globals are still read from ini.get - e.g. ini.get('table').
  Until all legacy commands are migrated, we need to support this.
 */
function _setupArgsInIniConfig(yargs){
  var argv = yargs.argv;
  argv = _.omit(argv, '_', '$0');
  _.each(argv, function(value, key){
    ini.set(key, value);
  });
}
