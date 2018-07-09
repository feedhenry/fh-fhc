#!/usr/bin/env node
(function() { // wrapper in case we're in module_context mode
  var fhc = require("../lib/fhc");
  var errorHandler = require("../lib/utils/error-handler");
  var resultHandler = require("../lib/utils/result-handler");

  var conf = {_exit: true};
  var argv = process.argv.slice(2);
  argv = (argv.length === 0) ? ['help'] : argv;
  argv = applyHelpCommand(argv);
  fhc.load(conf, function(err, conf) {
    if (err) {
      return errorHandler(err);
    }
    var cmd = fhc.applyCommandFunction(argv, function(err, data) {
      resultHandler.printCommandResult(err, data,conf,cmd);
    });
  });
})();

/**
 * This fuction was created in order to apply the command fhc help <commands> when the
 * input is fhc commands --help or fhc commands help. It is checking if the last position is the --help
 * or help and add it as the first position of the command.
 * @param argv
 * @returns {*}
 */
function applyHelpCommand(argv) {
  var lastPosition = argv[argv.length - 1];
  if (argv.length > 0 && (lastPosition === '--help' || lastPosition === 'help')) {
    var tmpArgv = ['help'];
    for (var i = 0; i < argv.length - 1; i++) {
      tmpArgv.push(argv[i]);
    }
    argv = tmpArgv;
  }
  return argv;
}